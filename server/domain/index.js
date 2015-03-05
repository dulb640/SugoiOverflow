'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = {
  Question : mongoose.model('Question', require('./question')),
  User     : mongoose.model('User', require('./user')),
  Answer   : mongoose.model('Answer', require('./answer'))
};
