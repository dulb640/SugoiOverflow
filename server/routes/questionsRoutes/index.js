'use strict'

var express = require('express')

var router = express.Router()
router.use(require('./getQuestionsRoutes'))
router.use(require('./getQuestionsForProfileRoutes'))
router.use(require('./addOrUpdateQuestionRoutes'))
router.use(require('./addOrUpdateAnswerRoutes'))

module.exports = router
