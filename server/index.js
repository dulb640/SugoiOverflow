'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy
var path = require('path')
var morgan = require('morgan')
var logger = require('./logger')
var config = require('./configuration')
var Promise = require('bluebird')

var mongoConnectionString = config('mongo')

if (mongoConnectionString.substring(0, 7) === ('tingodb')) {
  global.TUNGUS_DB_OPTIONS = { nativeObjectID: true, searchInArray: true }
  require('tungus')
}

var mongoose = require('mongoose')
var domain = require('./domain')
Promise.promisifyAll(mongoose)

mongoose.connect(mongoConnectionString)

var routes = require('./routes')

var app = express()

var jwtOptions = config('auth:jwt')
jwtOptions.authScheme = 'Bearer'
passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  domain.User.findByIdAsync(payload.sub)
    .then(function (user) {
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(function (error) {
      logger.error('Error getting user from database based on jwt payload', error)
    })
}))

if (config('auth:local')) {
  var LocalStrategy = require('passport-local').Strategy
  passport.use(new LocalStrategy(
    function (usernameOrEmail, password, done) {
      domain.User.findOneAsync({ username: usernameOrEmail })
        .then(function (user) {
          if (user) {
            return user
          } else {
            return domain.User.findOneAsync({ email: usernameOrEmail })
          }
        })
        .then(function (user) {
          if (!user) {
            logger.warn('User is not found for username or email: %s', usernameOrEmail)
            return done(null, false)
          }
          user.verifyPassword(password)
            .then(function (isValid) {
              if (!isValid) {
                logger.warn('Wrong password for username or email: %s', usernameOrEmail)
                return done(null, false)
              }
              return done(null, user)
            })
        })
    }
  ))
}

var ldapConfig = config('auth:ldap')
if (ldapConfig && config('auth:active-directory')) {
  var WindowsStrategy = require('passport-windowsauth')
  var authCallback = function authCallback (profile, done) {
    domain.User.findOneAsync({adId: profile.id})
      .then(function (user) {
        if (user) {
          done(null, user)
        } else {
          new domain.UserFeed().saveAsync()
            .spread(function (feed) {
              var newUser = new domain.User({
                adId: profile.id,
                username: profile._json.sAMAccountName,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                feed: feed.id
              })

              return newUser.saveAsync()
            })
            .spread(function (newUser) {
              done(null, newUser)
            })
            .catch(function (error) {
              done(null, false)
              logger.error('Error saving new user to database', error)
            })
        }
      })
      .catch(function (error) {
        logger.error('Error getting user from database based on AD id', error)
      })
  }
  var windowsStrategy = new WindowsStrategy({ ldap: ldapConfig }, authCallback)
  passport.use(windowsStrategy)
}

if (config('iis') && config('path')) {
  var rewriteIis = require('./iisIntegration')
  app.use(rewriteIis)
}

var morganLogger = morgan('short')
app.use(morganLogger)
app.use(passport.initialize())

app.use(bodyParser.json())
app.use(function (req, res, next) {
  if (req.user && !req.user.feed) {
    var newFeed = new domain.UserFeed()
    newFeed.saveAsync()
      .spread(function (feed) {
        req.user.feed = feed.id
        return req.user.saveAsync()
          .spread(function (updatedUser) {
            req.user = updatedUser
            next()
          })
      })
  } else {
    next()
  }
})

app.use('/content', express.static(path.join(__dirname, '../content')))
app.use(express.static(path.join(__dirname, '../build')))
app.use('/api', routes)

function handleGenericError (error) {
  switch (error.name) {
    case 'ValidationError':
      logger.error('Mongoose Validation failed', error.errors)
  }
}
app.use(function (error, req, res, next) {
  if (!error) {
    return next()
  }
  switch (error.name) {
    case 'JsonSchemaValidation':
      logger.warn('Validation failed when user %s tried to %s %s',
        req.user.username,
        req.method,
        req.url,
      error.validations)

      res
        .status(400)
        .send({
          statusText: 'Bad request',
          jsonSchemaValidation: true,
          validations: error.validations
        })

      return next()

    case 'NotFoundError':
      logger.warn('%s when user %s tried to %s %s',
        error.message,
        req.user.username,
        req.method,
        req.url)

      res
        .status(404)
        .send({
          statusText: 'Not found'
        })

      return next()

    case 'ArgumentError':
      logger.warn('Argument "%s" didn\'t meet requirements: %s',
        error.argumentName,
        error.message,
        error.stack)

      res
        .status(404)
        .send({
          statusText: 'Not found'
        })

      return next()

    case 'GenericError':
      logger.error('Generic Error: %s when user %s tried to %s %s',
        error.message,
        req.user.username,
        req.method,
        req.url,
        error.inner)

      handleGenericError(error.inner)

      res
        .status(500)
        .send({
          statusText: 'Internal server error'
        })

      return next()
    default:
      logger.error('Unexpected error when user %s tried to %s %s',
        req.user.username,
        req.method,
        req.url,
        error)

      res
        .status(500)
        .send({
          statusText: 'Internal server error'
        })

      return next()
  }
  return next(error)
})

// PORT is iis specific
app.listen(config('PORT') || config('port'))
