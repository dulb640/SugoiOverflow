'use strict'

var errors = require('../../errors')
var express = require('express')
var ObjectId = require('mongoose').Types.ObjectId

var router = express.Router()

var domain = require('../../domain')
var middleWares = require('./middleWares')

/**
 * @apiName GetAllQuestionsForUser
 * @api {get} /api/questions/profile/:username
 * @apiParam {string} username User's username
 * @apiDescription Get a list of questions asked by user
 * @apiGroup Questions
 * @apiUse QuestionSuccess
 */
router.get('/profile/:username/asked',

  middleWares.getUserByUsername,

  function getAskedQuestions (req, res, next) {
    req.foundUser.populateAsync('profile.asked', 'id title body answers.author answers.timestamp answers.correct subscribers tags timestamp')
      .then(function (populatedUser) {
        res
          .status(200)
          .send(populatedUser.profile.asked)
        next()
      })
      .catch(function (error) {
        return next(new errors.GenericError('Error getting asked questions', error))
      })
  })

router.get('/profile/:username/answered',

  middleWares.getUserByUsername,

  function getAnsweredQuestions (req, res, next) {
    req.foundUser.populateAsync('profile.answered', 'id title body answers.author answers.timestamp answers.correct subscribers tags timestamp')
      .then(function (populatedUser) {
        res
          .status(200)
          .send(populatedUser.profile.answered)
        next()
      })
      .catch(function (error) {
        return next(new errors.GenericError('Error getting answered questions', error))
      })
  })

router.get('/profile/:username/subscribed',

  middleWares.getUserByUsername,

  function getSubscribedQuestions (req, res, next) {
    domain.Question
      .find({'subscribers': {$elemMatch: { $eq: new ObjectId(req.foundUser.id)}} })
      .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
      .populate('author subscribers answers.author', 'profile username displayName email')
      .execAsync()
      .then(function (questions) {
        res
          .status(200)
          .send(questions)
        next()
      })
      .catch(function (error) {
        return next(new errors.GenericError('Error getting subscribed questions', error))
      })
  })

module.exports = router
