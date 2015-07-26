'use strict'

let express = require('express')
let questionsDataService = require('../../services/questionsDataService')
let router = express.Router()
let _ = require('lodash')
let logger = require('../../logger')
let middleWares = require('./middleWares')

/**
 * Get all questions
 */
router.get('/', function (req, res, next) {
  let match = {}
  let sort = {}
  if (req.query.tags) {
    let tags = req.query.tags.split(',')
    if (tags.length > 1) {
      match.tags = tags[0]
    } else {
      match.tags = { $in: tags }
    }
  }

  if (req.query.noCorrectAnswer) {
    match['answers.correct'] = {$ne: true}
    sort.subCount = -1
  }

  if (req.query.search) {
    match.$text = { $search: req.query.search }
    sort.score = { $meta: 'textScore' }
  }

  if (req.query.sort) {
    let sortProperties = req.query.sort.split(',')
    _.each(sortProperties, function (sortProperty) {
      if (sortProperty.length > 0 && sortProperty[0] === '-') {
        sort[sortProperty.slice(1, sortProperty.length)] = -1
      } else {
        sort[sortProperty] = 1
      }
    })
  }

  if (!sort.timestamp) {
    sort.timestamp = -1
  }

  questionsDataService.get(match, sort)
    .then(function (questions) {
      res
        .status(200)
        .send(questions)
      next()
    })
    .catch(function (error) {
      return next(error)
    })
})

/**
 * Get question by id
 */
router.get('/:questionId',

  middleWares.getQuestion,

  function sendQuestion (req, res, next) {
    req.question
      .populateAsync('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email feed')
      .then(function (question) {
        res
          .status(200)
          .send(question)
        next()
      })
      .catch(function (error) {
        logger.error('Error getting question', error)
        return next(error)
      })
  })

module.exports = router
