'use strict';

var domain      = require('../domain');
var logger      = require('../logger');
var express = require('express');
var router  = express.Router();
var validate    = require('express-jsonschema').validate;
var schemas     = require('./schemas');

/**
 * @apiName GetProfiles
 * @api {get} /api/profiles/
 * @apiDescription Get all users profiles
 * @apiGroup Profiles
 * @apiSuccess {Object[]}   .                                   List of users with populated profiles.
 * @apiSuccess {string}     .username                          Username.
 * @apiSuccess {string}     .email                             User email.
 * @apiSuccess {string}     .displayName                       Display name.
 * @apiSuccess {object}     .profile                           User profile.
 * @apiSuccess {string[]}   .profile.answered                  Ids of questions user answered
 * @apiSuccess {string[]}   .profile.asked                     Ids of questions user asked
 * @apiSuccess {string[]}   .profile.selectedTags              Tags user is following
 * @apiSuccess {string}     .profile.location                  User's location
 * @apiSuccess {number}     .profile.karma                     User's karma
 * @apiSuccess {object[]}   .profile.karmaChanges              Detailed info about changes applied to user's karma.
 * @apiSuccess {string}     .profile.karmaChanges.question     Id of question related to karma change.
 * @apiSuccess {date}       .profile.karmaChanges.timestamp    Date when karma change was applied
 * @apiSuccess {string}     .profile.karmaChanges.reason       Reason why karma change was applied
 * @apiSuccess {number}     .profile.karmaChanges.value        Value of karma change
 */
router.get('/', function(req, res, next){
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
      return next(error);
    });
});

router.get('/me', function(req, res){
    res
      .status(200)
      .send(req.user);
});

/**
 * @apiDefine FeedSuccess
 * @apiSuccess {string}     id                                     Id of a feed
 * @apiSuccess {object[]}   questionNotifications                  Notifications related to questions
 * @apiSuccess {string}     questionNotifications.id               Id of notification
 * @apiSuccess {string}     questionNotifications.body             Text of notification
 * @apiSuccess {string}     questionNotifications.question         Id of a question notification is related to
 * @apiSuccess {string}     questionNotifications.questionTitle    Title of a question notification is related to
 * @apiSuccess {bool}       questionNotifications.read             Is notification read by user
 * @apiSuccess {date}       questionNotifications.timestamp        Date of notification
 */

/**
 * @apiName GetOwnFeed
 * @api {get} /api/profiles/me/feed
 * @apiDescription Get own notifications feed
 * @apiGroup Profiles
 * @apiUse FeedSuccess
 */

router.get('/me/feed', function(req, res, next){
  req.user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      var feed = user.feed;
      res
        .status(200)
        .send(feed);
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      return next(error);
    });
});

/**
 * @apiName PutOwnFeedNotificationToRead
 * @api {put} /api/profiles/me/feed/:notificationId/read
 * @apiParam {string} notificationId Notification's id
 * @apiDescription Mark notification as read
 * @apiGroup Profiles
 * @apiUse FeedSuccess
 */
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
      });
    })
    .catch(function(error){
      logger.error('Error getting user feed', error);
      return next(error);
    });
});

router.get('/:username', function(req, res, next){
  domain.User
    .findOneQ({username: req.params.username})
    .then(function(user){
      res
        .status(200)
        .send(user);
    })
    .catch(function(error){
      logger.error('Error getting profile', error);
      return next(error);
    });
});

router.put('/me', validate({body: schemas.editProfileSchema}), function(req, res, next){
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
      return next(error);
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
    })
    .catch(function(error){
      logger.error('Error getting profile for tag', error);
      return next(error);
    });
});

module.exports = router;
