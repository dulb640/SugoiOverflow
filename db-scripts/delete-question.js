'use strict'
var assert = require('assert')
var minimist = require('minimist')
var _ = require('lodash')
var Promise = require('bluebird')
var MongoDB = require('mongodb')
var MongoClient = MongoDB.MongoClient
Promise.promisifyAll(MongoDB)
Promise.promisifyAll(MongoClient)

var argv = minimist(process.argv.slice(2))
assert(argv.url, 'Url for mongodb is not provided')
assert(argv.id, 'Question\'s id is not specified')
var id = new MongoDB.ObjectID(argv.id)

var connection = MongoClient.connectAsync(argv.url)
  .then(function (db) {
    console.log('Connection established')
    return db
  })
  .error(function (err) {
    console.error(err)
  })
  .disposer(function (db) {
    console.log('Closing connection...')
    db.close()
    console.log('Closed')
    process.exit(0)
  })

Promise.using(connection, function (db) {
  db.collection('questions').remove({_id: id}, { justOne: true })
  var users = db.collection('users')
  var userfeeds = db.collection('userfeeds')

  return users.find({'profile.asked': { $elemMatch: { $eq: id} } })
    .map(function (u) {
      console.log('Processing asked for user %s', u._id)
      u.profile.asked = _.filter(u.profile.asked, function (s) {
        return s && !s.equals(id)
      })
      return users.saveAsync(u)
    })
    .toArrayAsync()
    .then(function (promises) {
      return Promise.all(promises)
    })
    .then(function () {
      return users.find({'profile.answered': { $elemMatch: { $eq: id } } })
        .map(function (u) {
          console.log('Processing answered for user %s', u._id)
          u.profile.answered = _.filter(u.profile.answered, function (s) {
            return s && !s.equals(id)
          })

          return users.saveAsync(u)
        })
        .toArrayAsync()
    })
    .then(function (promises) {
      return Promise.all(promises)
    })
    .then(function () {
      return users.find({'profile.subscribed': { $elemMatch: { $eq: id } } })
        .map(function (u) {
          console.log('Processing subscribed for user %s', u._id)
          u.profile.subscribed = _.filter(u.profile.subscribed, function (s) {
            return s && !s.equals(id)
          })
          return users.saveAsync(u)
        })
        .toArrayAsync()
    })
    .then(function (promises) {
      return Promise.all(promises)
    })
    .then(function () {
      return users.find({
        'profile.karmaChanges': {
            $elemMatch: {
              question: {
                $eq: id
              }
            }
          }
        })
        .map(function (u) {
          console.log('Processing karmaChanges for user %s', u._id)
          u.profile.karmaChanges = _.filter(u.profile.karmaChanges, function (k) {
            return k && k.question && !k.question.equals(id)
          })
          return users.saveAsync(u)
        })
        .toArrayAsync()
    })
    .then(function (promises) {
      return Promise.all(promises)
    })
    .then(function () {
      return userfeeds.find({
        questionNotifications: {
          $elemMatch: {
            question: {
              $eq: id
            }
          }
        }
      })
      .map(function (f) {
        console.log('Processing feed %s', f._id)
        f.questionNotifications = _.filter(f.questionNotifications, function (n) {
          return n && n.question && !n.question.equals(id)
        })
        return userfeeds.saveAsync(f)
      })
      .toArrayAsync()
    })
    .then(function (promises) {
      return Promise.all(promises)
    })
    .error(function (err) {
      console.error(err)
    })
})
