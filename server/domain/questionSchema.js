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
  body:{
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
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  subscribers:[{
    type: ObjectId,
    ref: 'User'}]
});

Question.index({ body: 'text', title:'text', tags:'text', 'answers.body':'text' });

Question.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
module.exports = Question;
