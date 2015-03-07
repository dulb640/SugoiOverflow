'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var Answer = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp:{
    type: Date,
    'default': Date.now
  },
  text:{
    type: String,
    required: true
  },
  correct:{
    type: Boolean,
    required: true,
    default: false
  },
  upVotes:{
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  downVotes:{
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
});

module.exports = Answer;
