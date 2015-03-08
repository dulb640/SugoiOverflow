'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = {
  Question:               mongoose.model('Question', require('./questionSchema')),
  User:                   mongoose.model('User', require('./userSchema')),
  Answer:                 mongoose.model('Answer', require('./answerSchema')),
  QuestionNotification:   mongoose.model('QuestionNotification', require('./questionNotificationSchema')),
  UserFeed:               mongoose.model('UserFeed', require('./userFeedSchema'))
};
