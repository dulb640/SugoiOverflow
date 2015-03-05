'use strict';
var Router  = require('koa-router');
var router  = new Router();

router.use('/questions', require('./questions'));

module.exports = router;
