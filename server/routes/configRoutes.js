'use strict'

var express = require('express')
var config = require('../configuration')
var packageJson = require('../../package.json')
var router = express.Router()
router.get('/', function (req, res, next) {
  var clientConfig = {
    auth: {
      activeDirectory: config('auth:active-directory'),
      local: config('auth:local')
    },
    branding: {
      title: config('branding:title'),
      logo: config('branding:logo')
    },
    version: packageJson.version
  }

  res.send(clientConfig)
  next()
})

module.exports = router
