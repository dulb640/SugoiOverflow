'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema = mongoose.Schema;

var QuestionNotification = new Schema({
  question:{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: false
  },
  questionTitle: {
    type: String,
    required: false
  },
  timestamp:{
    type: Date,
    'default': Date.now
  },
  body:{
    type: String,
    required: true
  },
  viewed:{
    type: Boolean,
    required: true,
    default: false
  }
});

QuestionNotification.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
module.exports = QuestionNotification;
