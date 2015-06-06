'use strict';
var Promise =  require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var KarmaChange = new Schema({
  question:{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  timestamp:{
    type: Date,
    'default': Date.now
  },
  reason:{
    type: String,
    required: true
  },
  value:{
    type: Number,
    required: true
  }
});

KarmaChange.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
module.exports = KarmaChange;
