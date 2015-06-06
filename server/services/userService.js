'use strict';

var logger = require('../logger');
var domain = require('../domain');
function updateQuestionsFeed(user, question, message, karmaAdd){
  return domain.User.populateAsync(user, { path:'feed', select: 'questionNotifications'})
    .then(function(populatedUser){
      populatedUser = populatedUser[0];
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
