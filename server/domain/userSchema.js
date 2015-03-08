'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var KarmaChange = require('./karmaChangeSchema');

var User = new Schema({
  adId:{
    type: String,
    required: false,
    index: { unique: true }
  },
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    index: { unique: true }
  },
/*  password:{
    type: String,
    required: true
  },*/
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
    profilePictureUrl:{
      type: String
    },
    karmaChanges:{
      type: [KarmaChange],
      'default': []
    }
  },
  feed:{
    type: ObjectId,
    ref: 'UserFeed'
  }

/*  token:{
    data: {type: String},
    generated: {type: Date}
  }*/
});
User.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

User.methods.calculateKarma = function calculateKarma() {
  var sum = this.profile.karmaChanges
    .map(function(k){return k.value || 0; })
    .reduce(function(prev, next){return prev + next;});
  return sum;
};

module.exports = User;
