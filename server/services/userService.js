'use strict';

var config = require('../configuration');
var logger = require('../logger');
var domain = require('../domain');
var errors = require('../errors');
var util = require('util');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var handlebars = require('handlebars');
var templateCache = {};

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
      return new Promise(function(resolve, reject){
        if(templateCache.questionNotification){
          resolve(templateCache.questionNotification);
        } else {
          var templatePath = path.resolve(__dirname, '../templates/question-notification.html');
          fs.readFileAsync(templatePath, 'utf8')
            .then(function(text){
              templateCache.questionNotification = handlebars.compile(text);
              resolve(templateCache.questionNotification);
            })
            .catch(function(err){
              reject(err);
            });
        }
      });
    })
    .then(function(template){
      var url = util.format('%s://%s/%s/#/questions/%s/answers',
        config('protocol'),
        config('domain'),
        config('path'),
        question.id);

      var context = {
        branding: {
          title: config('branding:title')
        },
        notification: message,
        question:{
          title: question.title,
          url: url
        }
      };
      var body = template(context);
      var subject = util.format('New notification on %s', config('branding:title'));
      return notificationsService(subject, body, user);
    });
}

module.exports = {
  updateQuestionsFeed: updateQuestionsFeed
};
