'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema   = mongoose.Schema;

var User = new Schema({
  email:{
    type: String,
    required: true,
    index: { unique: true }
  },
  password:{
    type: String,
    required: true
  },
  registered:{
    type: Date,
    'default': Date.now
  },
  token:{
    data: {type: String},
    generated: {type: Date}
  }
});

module.exports = User;
