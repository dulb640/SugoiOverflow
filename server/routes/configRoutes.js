'use strict'

var express = require('express')
var config = require('../configuration')

var router = express.Router()
router.get('/', function (req, res, next) {
  var clientConfig = {
    auth: {
      activeDirectory: config('auth:active-directory'),
      local: config('auth:local')
    },
    branding: {
      title: config('branding:title')
    }
  }

  res.send(clientConfig)
  next()
})

module.exports = router
