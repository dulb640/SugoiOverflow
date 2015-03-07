'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Answer = require('./answerSchema');

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
    type: ObjectId,
    ref: 'User',
    required: true
  },
  subscribers:{
    type:[ObjectId],
    ref: 'User',
    default: [],
    index: true
  },
});

Question.index({ text: 'text', title:'text', tags:'text', 'answers.text':'text' });

module.exports = Question;
