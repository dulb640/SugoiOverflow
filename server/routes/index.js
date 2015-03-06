'use strict';

var express = require('express');
var router  = express.Router();

router.use('/questions', require('./questions'));
//router.use('/tags', require('./tags'));

module.exports = router;
