'use strict';

var config = require('../configuration');
var logger = require('../logger');
var domain = require('../domain');
var errors = require('../errors');
var util = require('util');

var notificationsService = require('./notificationsService');

function updateQuestionsFeed(user, question, message, karmaAdd){
  if(!user.feed){
    throw new errors.ArgumentError('Feed id should be fetched from db before being updated', 'user');
  }

  return domain.User.populateAsync(user, { path:'feed', select: 'questionNotifications'})
    .then(function(populatedUser){
      populatedUser.feed.questionNotifications.push({
        body:message,
        question: question.id,
        questionTitle: question.title
      });
      if(typeof karmaAdd === 'number'){
        populatedUser.profile.karmaChanges.push({
          value: karmaAdd,
          reason: message,
          question: question.id
        });
        return populatedUser.saveAsync()
          .then(function(){
            return populatedUser.feed;
          });
      }
      return populatedUser.feed;
    })
    .then(function(feed) {
      return feed.saveAsync()
        .catch(function(error){
          logger.error('Error updating user feed', error);
        });
    })
    .then(function(){
      var subject = util.format('New notification on %s', config('branding:title'));
      notificationsService(subject, message, user);
    });
}

module.exports = {
  updateQuestionsFeed: updateQuestionsFeed
};
