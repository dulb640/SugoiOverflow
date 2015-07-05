'use strict'

var domain = require('../domain')
var logger = require('../logger')
var express = require('express')
var router = express.Router()
var Promise = require('bluebird')

// Fix db problems
router.post('/db/fix-problems', function (req, res, next) {
  var fixedProblems = []
  var stream = domain.User.find().stream()

  stream.on('data', function (user) {
    var self = this
    self.pause()
    var promise = new Promise(function (resolve, reject) {
      if (!user.feed) {
        resolve(true)
      } else {
        return domain.UserFeed.findByIdAsync(user.feed)
          .then(function (feed) {
            if (!feed) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch(function (error) {
            reject(error)
          })
      }

      resolve(false)
    })

    promise.then(function (needToCreateFeed) {
      if (needToCreateFeed) {
        return new domain.UserFeed().saveAsync()
          .spread(function (feed) {
            user.feed = feed.id
            return user.saveAsync()
          })
          .then(function () {
            fixedProblems.push('Created missing user feed for ' + user.username)
          })
      }
    })
    .finally(function () {
      self.resume()
    })
  })
  stream.on('close', function () {
    logger.info('Fixed db problems', fixedProblems)
    res.send(fixedProblems)
  })
})

module.exports = router
