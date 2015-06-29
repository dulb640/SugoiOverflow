'use strict';
var assert = require('assert');
var changeCase = require('change-case');
var minimist = require('minimist');
var _ = require('lodash');
var Promise = require('bluebird');
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
Promise.promisifyAll(MongoDB);
Promise.promisifyAll(MongoClient);

var argv = minimist(process.argv.slice(2));
assert(argv.url, 'Url for mongodb is not provided');
var connection = MongoClient.connectAsync(argv.url)
  .then(function(db) {
    console.log('Connection established');
    return db;
  })
  .error(function(err) {
    console.error(err);
  })
  .disposer(function (db) {
    console.log('Closing connection...');
    db.close();
    console.log('Closed');
    process.exit(0);
  });

Promise.using(connection, function (db) {
  console.log('Start renaming tags for questions');
  var questions = db.collection('questions');
  var questionsCursor = questions.find({tags: {$not: {$size: 0}}});
  return questionsCursor.map(function(q) {
    console.log('Processing question %s', q._id);
    var tags = _.map(q.tags, function(t) {
      return changeCase.paramCase(t);
    });
    console.log('%s -> %s', q.tags, tags);
    q.tags = tags;
    return questions.saveAsync(q);
  })
  .toArrayAsync()
  .then(function(promises) {
    return Promise.all(promises);
  })
  .then(function() {
    var users = db.collection('users');
    var usersCursor = users.find({'profile.selectedTags': {$not: {$size: 0}}});
    return usersCursor.map(function(u) {
      console.log('Processing user %s', u._id);
      var tags = _.map(u.profile.selectedTags, function(t) {
        return changeCase.paramCase(t);
      });
      console.log('%s -> %s', u.profile.selectedTags, tags);
      u.profile.selectedTags = tags;
      return users.saveAsync(u);
    })
    .toArrayAsync();
  })
  .then(function(promises) {
    return Promise.all(promises);
  })
  .error(function(err) {
    console.error(err);
  });
});
