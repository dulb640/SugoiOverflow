'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var KarmaChange = require('./karmaChangeSchema');
var config = require('../configuration');

var User = new Schema({
  adId:{
    type: String,
    required: false,
    index: { unique: true, sparse: true }
  },
  username:{
    type: String,
    required: true,
    index: { unique: true }
  },
  displayName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    index: { unique: true }
  },
  password:{
    type: String,
    required: false
  },
  salt:{
    type: String,
    required: false
  },
  registered:{
    type: Date,
    'default': Date.now
  },
  profile: {
    location:{
      type: String,
      default:''
    },
    selectedTags:{
      type: [String],
      default:[]
    },
    asked:[{
      type: ObjectId,
      ref: 'Question'
    }],
    answered:[{
      type: ObjectId,
      ref: 'Question'
    }],
    karmaChanges:{
      type: [KarmaChange],
      'default': []
    }
  },
  feed:{
    type: ObjectId,
    ref: 'UserFeed'
  }
});
User.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;

    delete ret.salt;
    delete ret.password;
    delete ret.feed;
    delete ret.__v;
  },
  virtuals: true
});

User.set('toObject', {
  virtuals: true
});


User.methods.setPassword = function setPassword(password) {
  var pepper = config('auth:pepper');
  var q = require('q');
  var bcrypt = require('bcrypt');

  var self = this;
  return q.nfcall(bcrypt.genSalt, 10, null)
    .then(function(salt) {
      self.salt = salt;
      return q.nfcall(bcrypt.hash, password + pepper, salt);
    })
    .then(function(hash){
      self.password = hash;
      return self;
    });
};

User.methods.verifyPassword = function verifyPassword(password) {
  var pepper = config('auth:pepper');
  var q = require('q');
  var bcrypt = require('bcrypt');

  return q.nfcall(bcrypt.compare, password + pepper, this.password)
    .then(function(isValid){
      return isValid;
    });
};

User.virtual('profile.karma').get(function calculateKarma() {
  if(!this.profile.karmaChanges || this.profile.karmaChanges.length === 0){
    return 0;
  }

  var sum = this.profile.karmaChanges
    .map(function(k){return k.value || 0; })
    .reduce(function(prev, next){return prev + next;});
  return sum;
});

module.exports = User;
