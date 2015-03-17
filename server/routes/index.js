'use strict';

var express = require('express');
var passport = require('passport');
var secure = require('./secure');


var router  = express.Router();
router.use('/auth', 		                                                require('./authRoutes'));
router.use('/files', 	   /*passport.authenticate('jwt', { session: false}),*/ require('./filesRoutes'));

router.use('/questions',   secure(), require('./questionsRoutes'));
router.use('/profiles',    passport.authenticate('jwt', { session: false}), require('./profilesRoutes'));
router.use('/tags',        passport.authenticate('jwt', { session: false}), require('./tagsRoutes'));
router.use('/suggestions', passport.authenticate('jwt', { session: false}), require('./suggestionsRoutes'));


module.exports = router;
