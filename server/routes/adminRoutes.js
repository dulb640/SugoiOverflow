'use strict'

var domain = require('../domain')
var logger = require('../logger')
var express = require('express')
var router = express.Router()
var validate = require('express-jsonschema').validate
var schemas = require('./schemas')
// Get all users profiles
router.get('/', function (req, res, next) {
  res.send('hallo')
})

module.exports = router
