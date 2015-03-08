'use strict';

var express = require('express');
var router  = express.Router();

router.use('/questions', require('./questionsRoutes'));
router.use('/profiles', require('./profilesRoutes'));
router.use('/tags', require('./tagsRoutes'));


module.exports = router;
