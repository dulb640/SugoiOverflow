'use strict';
var express =  require('express');
var passport = require('passport');
var jwt =      require('jwt-simple');
var domain = require('../domain');
var logger = require('../logger');
var config = require('../configuration');

var router = express.Router();
var jwtOptions = config('auth:jwt');

function generateJwt (req, res, next){
  var payload = {
    iss: jwtOptions.issuer,
    aud: jwtOptions.audience,
    sub: req.user.id
  };

  var token = jwt.encode(payload, jwtOptions.secretOrKey);
  var result = {
    jwt: token,
    username: req.user.username,
    displayName: req.user.displayName,
    email: req.user.email
  };
  res
    .status(200)
    .send(result);

  next();
}
function adIsDisabledResponse(req, res, next){
  res
    .status(400)
    .send('Active directory integration is disabled in configuration');
  next();
}
if(config('auth:ldap') && config('auth:active-directory')){
  router.get('/active-directory', passport.authenticate('WindowsAuthentication', { session: false }), function (req, res, next) {
    if(req.user){
      res
        .send({
          user: req.user.email
        });
    } else{
      res
        .send();
    }
    next();
  });
  router.post('/active-directory', passport.authenticate('WindowsAuthentication', { session: false }), generateJwt);
} else {
  router.get('/active-directory', adIsDisabledResponse);
  router.post('/active-directory', adIsDisabledResponse);
}

if(config('auth:local')){
  router.post('/local', passport.authenticate('local', { session: false }), generateJwt);
  router.post('/local/register', function (req, res, next) {
    new domain.UserFeed().saveQ()
    .then(function (feed) {
      var newUser = new domain.User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName || req.body.username,
        feed: feed.id
      });

      return newUser.setPassword(req.body.password);
    })
    .then(function (newUser) {
      return newUser.saveQ();
    })
    .then(function () {
      res
        .status(200)
        .send();

      next();
    })
    .catch(function (error) {
      logger.error('Error during registration of new user with username %s', req.body.username, error);
      next(error);
    });
  });
} else {
  var disabledHandler = function (req, res, next){
    res
      .status(400)
      .send('Local authentication is disabled in configuration');
    next();
  };

  router.post('/local', disabledHandler);
  router.post('/local/register', disabledHandler);
}

module.exports = router;
