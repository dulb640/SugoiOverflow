'use strict';

var Promise =              require('bluebird');
var mongoose =             Promise.promisifyAll(require('mongoose'));
var Schema =               mongoose.Schema;
var QuestionNotification = require('./questionNotificationSchema');

var UserFeed = new Schema({
  questionNotifications:{
    type: [QuestionNotification],
    required: false,
    default: []
  }
});

UserFeed.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
module.exports = UserFeed;
