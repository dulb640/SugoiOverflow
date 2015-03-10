'use strict';

var express = require('express');
var router  = express.Router();

router.use('/questions', require('./questionsRoutes'));
router.use('/profiles', require('./profilesRoutes'));
router.use('/tags', require('./tagsRoutes'));
router.use('/suggestions', require('./suggestionsRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;
