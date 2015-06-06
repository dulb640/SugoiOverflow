'use strict';
var Promise =  require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema =   mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Answer =   require('./answerSchema');
var Comment =  require('./commentSchema');

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
    default: []
  },
  comments:{
    type:[Comment],
    default: []
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
  proposedPeople:[{
    type: ObjectId,
    ref: 'User'}],
  subscribers:[{
    type: ObjectId,
    ref: 'User'}]
});

Question.index({
  'body': 'text',
  'title':'text',
  'tags':'text',
  'answers.body':'text',
  'answers.comments.body':'text',
  'comments.body':'text' });

Question.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = Question;
