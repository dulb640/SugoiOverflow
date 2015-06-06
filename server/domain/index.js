'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose');

var models = {
  Question:               mongoose.model('Question', require('./questionSchema')),
  User:                   mongoose.model('User', require('./userSchema')),
  Answer:                 mongoose.model('Answer', require('./answerSchema')),
  QuestionNotification:   mongoose.model('QuestionNotification', require('./questionNotificationSchema')),
  UserFeed:               mongoose.model('UserFeed', require('./userFeedSchema')),
  Comment:                mongoose.model('Comment', require('./commentSchema'))
};


Promise.promisifyAll(models.Question);
Promise.promisifyAll(models.User);
Promise.promisifyAll(models.Answer);
Promise.promisifyAll(models.QuestionNotification);
Promise.promisifyAll(models.UserFeed);
Promise.promisifyAll(models.Comment);

Promise.promisifyAll(models.Question.prototype);
Promise.promisifyAll(models.User.prototype);
Promise.promisifyAll(models.Answer.prototype);
Promise.promisifyAll(models.QuestionNotification.prototype);
Promise.promisifyAll(models.UserFeed.prototype);
Promise.promisifyAll(models.Comment.prototype);

module.exports = models;
