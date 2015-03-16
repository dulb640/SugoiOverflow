'use strict';
var express =  require('express');
var passport = require('passport');
var jwt =      require('jwt-simple');
var domain = require('../domain');
var logger = require('../logger');
var config = require('../configuration');

var router = express.Router();
var jwtOptions = config('auth:jwt');

function generateJwt (req, res){
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
}

if(config('ldap') && config('auth:active-directory')){
  router.post('/active-directory', passport.authenticate('WindowsAuthentication', { session: false }), generateJwt);
} else {
  router.post('/active-directory', function(req, res){
    res
      .status(400)
      .send('Active directory integration is disabled in configuration');
  });
}

if(config('auth:local')){
  router.post('/local', passport.authenticate('local', { session: false }), generateJwt);
  router.post('/local/register', function (req, res) {
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
    })
    .catch(function (error) {
      logger.error('Error during registration of new user with username %s', req.body.username, error);
      res
        .status(500)
        .send();
    });
  });
} else {
  var disabledHandler = function (req, res){
    res
      .status(400)
      .send('Local authentication is disabled in configuration');
  };

  router.post('/local', disabledHandler);
  router.post('/local/register', disabledHandler);
}

module.exports = router;
