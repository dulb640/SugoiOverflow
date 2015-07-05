'use strict'

var domain = require('../domain')
var logger = require('../logger')
var express = require('express')
var router = express.Router()
var validate = require('express-jsonschema').validate
var schemas = require('./schemas')

// Get all users profiles
router.get('/', function (req, res, next) {
  domain.User
    .find()
    .select('username displayName email profile')
    .execAsync()
    .then(function (users) {
      res
        .status(200)
        .send(users)
    })
    .catch(function (error) {
      logger.error('Error getting profiles', error)
      return next(error)
    })
})

router.get('/me', function (req, res) {
  res
    .status(200)
    .send(req.user)
})

// Get own notifications feed
router.get('/me/feed', function (req, res, next) {
  req.user.populateAsync('feed', 'questionNotifications')
    .then(function (user) {
      var feed = user.feed
      res
        .status(200)
        .send(feed)
    })
    .catch(function (error) {
      logger.error('Error getting user feed', error)
      return next(error)
    })
})

// Mark notification as read
router.put('/me/feed/:notificationId/read', function (req, res, next) {
  req.user.populateAsync('feed', 'questionNotifications')
    .then(function (user) {
      var feed = user.feed
      var notification = feed.questionNotifications.id(req.params.notificationId)
      notification.read = true
      return feed.saveAsync().spread(function (savedFeed) { //  have to use spread because of non-standard callback
        res
          .status(200)
          .send(savedFeed)
      })
    })
    .catch(function (error) {
      logger.error('Error getting user feed', error)
      return next(error)
    })
})

router.get('/:username', function (req, res, next) {
  domain.User
    .findOneAsync({username: req.params.username})
    .then(function (user) {
      res
        .status(200)
        .send(user)
    })
    .catch(function (error) {
      logger.error('Error getting profile', error)
      return next(error)
    })
})

router.put('/me', validate({body: schemas.editProfileSchema}), function (req, res, next) {
  req.user.profile.location = req.body.location
  req.user.profile.selectedTags = req.body.selectedTags
  req.user.saveAsync()
  .spread(function (profile) {
    res
      .status(200)
      .send(profile)
  })
  .catch(function (error) {
    logger.error('Error updating profile', error)
    return next(error)
  })
})

router.get('/tag/:tag', function (req, res, next) {
  domain.User
    .find({'profile.selectedTags': req.params.tag})
    .select('username displayName email profile')
    .execAsync()
    .then(function (users) {
      res
        .status(200)
        .send(users)
    })
    .catch(function (error) {
      logger.error('Error getting profile for tag', error)
      return next(error)
    })
})

module.exports = router
