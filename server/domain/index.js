'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = {
  Question : mongoose.model('Question', require('./questionSchema')),
  User     : mongoose.model('User', require('./userSchema')),
  Answer   : mongoose.model('Answer', require('./answerSchema'))
};
