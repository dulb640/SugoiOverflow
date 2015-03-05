'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;
var Answer = require('./answer');

var Question = new Schema({
  title:{
    type: String,
    required: true
  },
  text:{
    type: String,
    required: true
  },
  answers:{
    type:[Answer],
    default: [],
    index: true
  },
  tags:{
    type: [String],
    required: true,
    index: true
  },
  timestamp:{
    type: Date,
    'default': Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

Question.index({ text: 'text' });

module.export = Question;