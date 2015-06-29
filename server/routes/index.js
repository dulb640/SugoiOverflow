'use strict'

var express = require('express')
var passport = require('passport')

var router = express.Router()
router.use('/config', require('./configRoutes'))

router.use('/auth', require('./authRoutes'))
router.use('/files', require('./filesRoutes'))

router.use('/questions', passport.authenticate('jwt', { session: false}), require('./questionsRoutes'))
router.use('/profiles', passport.authenticate('jwt', { session: false}), require('./profilesRoutes'))
router.use('/tags', passport.authenticate('jwt', { session: false}), require('./tagsRoutes'))
router.use('/suggestions', passport.authenticate('jwt', { session: false}), require('./suggestionsRoutes'))

module.exports = router
