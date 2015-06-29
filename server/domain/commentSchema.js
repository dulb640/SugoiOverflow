'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Comment = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    'default': Date.now
  },
  body: {
    type: String,
    required: true
  }
})

Comment.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = Comment
