'use strict';

var domain      = require('../domain');
var logger      = require('../logger');
var express = require('express');
var router  = express.Router();



router.get('/', function(req, res, next){
  domain.User
    .find()
    .select('username displayName email profile')
    .execQ()
    .then(function(users){
      res
        .status(200)
        .send(users);

      next();
    })
    .catch(function(error){
      logger.error('Error getting profiles', error);
      next(error);
    });
});



router.get('/me', function(req, res, next){
    res
      .status(200)
      .send(req.user);

    next();
});

router.get('/me/feed', function(req, res, next){
  req.user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      var feed = user.feed;
      res
        .status(200)
        .send(feed);

      next();
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      next(error);
    });
});

router.put('/me/feed/:notificationId/read', function(req, res, next){
  req.user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      var feed = user.feed;
      var notification = feed.questionNotifications.id(req.params.notificationId);
      notification.read = true;
      feed.saveQ().then(function(feed){
        res
          .status(200)
          .send(feed);
        next();
      });
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      next(error);
    });
});

router.get('/:username', function(req, res, next){
  domain.User
    .findOneQ({username: req.params.username})
    .then(function(user){
      res
        .status(200)
        .send(user);
      next();
    })
    .catch(function(error){
      logger.error('Error getting profile', error);
      next(error);
    });
});

router.put('/me', function(req, res, next){
    req.user.profile.location = req.body.location;
    req.user.profile.selectedTags = req.body.selectedTags;
    req.user.saveQ()
    .then(function(profile){
      res
        .status(200)
        .send(profile);
        next();
    })
    .catch(function(error){
      logger.error('Error updating profile', error);
      next(error);
    });
});

router.get('/tag/:tag', function(req, res, next){
  domain.User
    .find({'profile.selectedTags': req.params.tag})
    .select('username displayName email profile')
    .execQ()
    .then(function(users){
      res
        .status(200)
        .send(users);
        next();
    })
    .catch(function(error){
      logger.error('Error getting profile for tag', error);
      next(error);
    });
});

module.exports = router;
