'use strict';

var express =           require('express');
var bodyParser =        require('body-parser');
var passport =          require('passport');
var JwtStrategy =       require('passport-jwt').Strategy;
var path =              require('path');
var morgan =            require('morgan');
var mongoose =          require('mongoose-q')(require('mongoose'));
var logger =            require('./logger');
var config =            require('./configuration');
var domain =            require('./domain');

var mongoConnectionString = config('mongo');
mongoose.connect(mongoConnectionString);

var routes =            require('./routes');

var app = express();

var jwtOptions = config('auth:jwt');
jwtOptions.authScheme = 'Bearer';
passport.use(new JwtStrategy(jwtOptions, function(payload, done) {
  domain.User.findByIdQ(payload.sub)
    .then(function(user){
      if(user){
        done(null, user);
      } else{
        done(null, false);
      }
    })
    .catch(function(error){
      logger.error('Error getting user from database based on jwt payload', error);
    });
}));

if(config('auth:local')){
  var LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(
    function(usernameOrEmail, password, done) {
      domain.User.findOneQ({ username: usernameOrEmail })
        .then(function(user) {
          if(user){
            return user;
          } else{
            return domain.User.findOneQ({ email: usernameOrEmail });
          }
        })
        .then(function(user){
          if(!user){
            logger.warn('User is not found for username or email: %s', usernameOrEmail);
            return done(null, false);
          }
          user.verifyPassword(password)
            .then(function(isValid){
              if (!isValid) {
                logger.warn('Wrong password for username or email: %s', usernameOrEmail);
                return done(null, false);
              }
              return done(null, user);
            });
        });
    }
  ));
}

var ldapConfig = config('ldap');
if(ldapConfig && config('auth:active-directory')){
  var WindowsStrategy = require('passport-windowsauth');
  var authCallback = function authCallback(profile, done){
    domain.User.findOneQ({adId: profile.id})
      .then(function(user){
        if(user){
          done(null, user);
        }
        else{
          new domain.UserFeed().saveQ()
            .then(function (feed) {
              var newUser = new domain.User({
                adId: profile.id,
                username: profile._json.sAMAccountName,
                email: profile.emails[0].value,
                name: profile.displayName,
                feed: feed.id
              });

              return newUser.saveQ();
            })
            .then(function(newUser){
              done(null, newUser);
            })
            .catch(function(error){
              logger.error('Error saving new user to database', error);
            });
        }
      })
      .catch(function(error){
        logger.error('Error getting user from database based on AD id', error);
      });
  };
  var windowsStrategy = new WindowsStrategy({ ldap: ldapConfig }, authCallback);
  passport.use(windowsStrategy);
}

if(config('iis') && config('path')){
  var rewriteIis = require('./iisIntegration');
  app.use(rewriteIis);
}

var morganLogger = morgan('short');
app.use(morganLogger);
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(function(req, res, next){
  if(req.user && !req.user.feed){
    var newFeed = new domain.UserFeed();
    newFeed.saveQ()
      .then(function(feed){
        req.user.feed = feed.id;
        return req.user.saveQ()
          .then(function(updatedUser){
            req.user = updatedUser;
            next();
          });
      });
  }
  else{
    next();
  }
});

app.use('/api', routes);
app.use('/content', express.static(path.join(__dirname, '../content')));
app.use(express.static(path.join(__dirname, '../build')));

app.listen(config('PORT') || config('port'));
