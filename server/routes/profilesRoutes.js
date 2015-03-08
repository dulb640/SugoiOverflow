'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var express = require('express');
var router  = express.Router();

function mapProfile(user){
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    location: user.profile.location,
    selectedTags:user.profile.selectedTags,
    karma: 0 //TODO: Change to use real karma
  };
}

router.get('/', function(req, res){
  domain.User
    .find()
    .select('id name email profile')
    .execQ()
    .then(function(users){
      var profiles = users.map(mapProfile);
      res
        .status(200)
        .send(profiles);
    })
    .catch(function(error){
      logger.error('Error getting profiles', error);
      res
        .status(500)
        .send();
    });
});



router.get('/me', function(req, res){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      var profile = mapProfile(user);
      res
        .status(200)
        .send(profile);
    })
    .catch(function(error){
      logger.error('Error getting profile', error);
      res
        .status(500)
        .send();
    });
});

router.get('/me/feed', function(req, res){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      return user.populateQ('feed', 'questionNotifications');
    })
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
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      return user.populateQ('feed', 'questionNotifications');
    })
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

router.get('/:id', function(req, res){
  domain.User
    .findByIdQ(req.params.id)
    .then(function(user){
      var profile = mapProfile(user);
      res
        .status(200)
        .send(profile);
    })
    .catch(function(error){
      logger.error('Error getting profile', error);
      res
        .status(500)
        .send();
    });
});

router.put('/me', function(req, res){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      user.profile.location = req.body.location;
      user.profile.selectedTags = req.body.selectedTags;
      return user.saveQ();
    })
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
    .select('id name email profile')
    .execQ()
    .then(function(users){
      var profiles = users.map(mapProfile);
      res
        .status(200)
        .send(profiles);
    })
    .catch(function(error){
      logger.error('Error getting profile for tag', error);
      res
        .status(500)
        .send();
    });
});

module.exports = router;
