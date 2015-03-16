'use strict';

var domain      = require('../domain');
var logger      = require('../logger');
var express = require('express');
var router  = express.Router();



router.get('/', function(req, res){
  domain.User
    .find()
    .select('username displayName email profile')
    .execQ()
    .then(function(users){
      res
        .status(200)
        .send(users);
    })
    .catch(function(error){
      logger.error('Error getting profiles', error);
      res
        .status(500)
        .send();
    });
});



router.get('/me', function(req, res){
      res
        .status(200)
        .send(req.user);
});

router.get('/me/feed', function(req, res){
  req.user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      var feed = user.feed;
      res
        .status(200)
        .send(feed);
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      res
        .status(500)
        .send();
    });
});

router.put('/me/feed/:notificationId/read', function(req, res){
  req.user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      var feed = user.feed;
      var notification = feed.questionNotifications.id(req.params.notificationId);
      notification.read = true;
      feed.saveQ().then(function(feed){
        res
          .status(200)
          .send(feed);
      });
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      res
        .status(500)
        .send();
    });
});

router.get('/:username', function(req, res){
  domain.User
    .findOneQ({username: req.params.username})
    .then(function(user){
      res
        .status(200)
        .send(user);
    })
    .catch(function(error){
      logger.error('Error getting profile', error);
      res
        .status(500)
        .send();
    });
});

router.put('/me', function(req, res){
    req.user.profile.location = req.body.location;
    req.user.profile.selectedTags = req.body.selectedTags;
    req.user.saveQ()
    .then(function(profile){
      res
        .status(200)
        .send(profile);
    })
    .catch(function(error){
      logger.error('Error updating profile', error);
      res
        .status(500)
        .send();
    });
});

router.get('/tag/:tag', function(req, res){
  domain.User
    .find({'profile.selectedTags': req.params.tag})
    .select('username displayName email profile')
    .execQ()
    .then(function(users){
      res
        .status(200)
        .send(users);
    })
    .catch(function(error){
      logger.error('Error getting profile for tag', error);
      res
        .status(500)
        .send();
    });
});

module.exports = router;
