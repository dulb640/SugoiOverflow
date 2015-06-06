'use strict';

var logger = require('../logger');
var domain = require('../domain');
var errors = require('../errors');
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
        return populatedUser.saveAsync();
      }
      return populatedUser;
    })
    .then(function(populatedUser) {
      return populatedUser.feed.saveAsync()
        .catch(function(error){
          logger.error('Error updating user feed', error);
        });
    });
}

module.exports = {
  updateQuestionsFeed: updateQuestionsFeed
};
