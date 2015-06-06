'use strict';

var domain          = require('../../domain');
var logger          = require('../../logger');

var _               = require('lodash');
var Promise         = require('bluebird');
var express         = require('express');
var validate        = require('express-jsonschema').validate;
var router          = express.Router();
var schemas         = require('../schemas');
var userService     = require('../../services/userService');
var middleWares     = require('./middleWares');

/**
 * Add question
 */
router.post('/',
  validate({body: schemas.addOrEditQuestionSchema}),

  function createQuestion(req, res, next) {
    var question = new domain.Question(_.extend(req.body, {author: req.user.id}));
    question.subscribers.push(req.user.id);
    req.question = question;
    next();
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed(req, res, next) {
    req.user.profile.asked.push(req.question.id);
    req.user.saveAsync()
      .then(function() {
        var promises = req.body.people.map(function(email) {
          return domain.User.findAsync({email: email})
            .then(function(person) {
              if(!person) {
                return;
              }
              userService.updateQuestionsFeed(person, req.question, 'You have been proposed to answer the question');
            });
        });
        return Promise.all(promises);
      })
      .then(function(){
        next();
      })
      .catch(function(error) {
        logger.error('Error updating user or feed', error, error.errors);
        next(error);
      });
});

/* Add comment to question */
router.post('/:questionId/comment',

  validate({body: schemas.addOrEditCommentSchema}),

  middleWares.getQuestion,

  function(req, res, next) {
    req.question.comments.push({
      author: req.user.id,
      body: req.body.body
    });
    next();
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed(req, res, next) {
    req.user.profile.answered.push(req.question.id);
    req.user.saveAsync()
      .catch(function(e) {
        logger.error('Error saving user', e);
        return next(e);
      })
      .then(function() {
        var promises = req.question.subscribers
          .filter(function(sub) {
            return sub.id !== req.user.id;
          })
          .map(function(sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has a new comment');
          });
        return Promise.all(promises);
      })
      .then(function() {
        next();
      });
  }
);

/**
 * Subscribe to question
 */
router.put('/:questionId/subscribe',

  middleWares.getQuestion,

  function addSubscriber(req, res, next) {
    req.question.subscribers.push(req.user.id);
    next();
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed(req, res, next) {
    userService.updateQuestionsFeed(req.question.author, req.question, 'Question has a new subscriber', 2)
      .then(function(){
        next();
      });
});

module.exports = router;
