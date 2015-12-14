'use strict'

var domain = require('../../domain')
var errors = require('../../errors')

var logger = require('../../logger')

var _ = require('lodash')
var Promise = require('bluebird')
var express = require('express')
var validate = require('express-jsonschema').validate
var router = express.Router()
var schemas = require('../schemas')
var userService = require('../../services/userService')
var middleWares = require('./middleWares')
var roles = require('../roles')
let ObjectId = require('mongoose').Types.ObjectId

/**
 * Add question
 */
router.post('/',
  validate({body: schemas.addOrEditQuestionSchema}),

  function createQuestion (req, res, next) {
    var question = new domain.Question(_.extend(req.body, {author: req.user.id}))
    question.subscribers.push(req.user.id)
    req.question = question
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed (req, res, next) {
    req.user.profile.asked.push(req.question.id)
    req.user.saveAsync()
      .then(function () {
        return domain.User.find({email: {$in: req.body.people} })
          .select('feed')
          .execAsync()
          .then(function (people) {
            if (!people) {
              return
            }
            var promises = people.map(function (person) {
              return userService.updateQuestionsFeed(person, req.question, 'You have been proposed to answer the question')
            })
            return Promise.all(promises)
          })
      })
      .then(function () {
        next()
      })
      .catch(function (error) {
        next(error)
      })
  })

/**
 * Edit question
 */
router.put('/:questionId',
  validate({body: schemas.addOrEditQuestionSchema}),

  middleWares.getQuestion,

  function editQuestion(req, res, next) {
    req.question.title = req.body.title
    req.question.body = req.body.body
    req.question.tags = req.body.tags
    // KNOWN BUG: proposed people doesn't work
    //req.question.people = req.body.proposedPeople
    next()
  },

  middleWares.saveQuestionAndSend/*,

  function updateUserAndFeed (req, res, next) {
    req.user.profile.asked.push(req.question.id)
    req.user.saveAsync()
      .then(function () {
        return domain.User.find({email: {$in: req.body.people} })
          .select('feed')
          .execAsync()
          .then(function (people) {
            if (!people) {
              return
            }
            var promises = people.map(function (person) {
              return userService.updateQuestionsFeed(person, req.question, 'You have been proposed to answer the question')
            })
            return Promise.all(promises)
          })
      })
      .then(function () {
        next()
      })
      .catch(function (error) {
        next(error)
      })
  }*/
  )

/* Add comment to question */
router.post('/:questionId/comment',

  validate({body: schemas.addOrEditCommentSchema}),

  middleWares.getQuestion,

  function addComment (req, res, next) {
    req.question.comments.push({
      author: req.user.id,
      body: req.body.body
    })
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed (req, res, next) {
    req.user.profile.answered.push(req.question.id)
    req.user.saveAsync()
      .catch(function (e) {
        logger.error('Error saving user', e)
        return next(e)
      })
      .then(function () {
        var promises = req.question.subscribers
          .filter(function (sub) {
            return sub.id !== req.user.id
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has a new comment')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  }
)

/* Edit comment to question */
router.put('/:questionId/comment/:commentId',

  validate({body: schemas.addOrEditCommentSchema}),

  middleWares.getQuestion,

  middleWares.getQuestionComment,

  function (req, res, next) {
    req.comment.body = req.body.body
    next()
  },

  middleWares.saveQuestionAndSend/*,

  function updateUserAndFeed (req, res, next) {
    req.user.profile.answered.push(req.question.id)
    req.user.saveAsync()
      .catch(function (e) {
        logger.error('Error saving user', e)
        return next(e)
      })
      .then(function () {
        var promises = req.question.subscribers
          .filter(function (sub) {
            return sub.id !== req.user.id
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has a new comment')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  }*/
)

/* delete comment to question */
router.delete('/:questionId/comment/:commentId',

  middleWares.getQuestion,

  function (req, res, next) {
    req.question.comments = req.question.comments.filter(function (comment) {
      return comment._id != req.params.commentId
    })
    next()
  },

  middleWares.saveQuestionAndSend/*,

  function updateUserAndFeed (req, res, next) {
    req.user.profile.answered.push(req.question.id)
    req.user.saveAsync()
      .catch(function (e) {
        logger.error('Error saving user', e)
        return next(e)
      })
      .then(function () {
        var promises = req.question.subscribers
          .filter(function (sub) {
            return sub.id !== req.user.id
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has a new comment')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  }*/
)

/**
 * Subscribe to question
 */
router.put('/:questionId/subscribe',

  middleWares.getQuestion,

  function addSubscriber (req, res, next) {
    if (_.includes(req.question.subscribers, req.user.id)) {
      next(new errors.InvalidOperationError('Already subscribed to this question'))
    }
    req.question.subscribers.push(req.user.id)
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateUserAndFeed (req, res, next) {
    userService.updateQuestionsFeed(req.question.author, req.question, 'Question has a new subscriber', 2)
      .then(function () {
        next()
      })
  })

  /**
   * Delete question
   */
router.delete('/:questionId',

  /*roles(['moderator', 'admin']),*/

  function deleteQuestion (req, res, next) {
    logger.info('${req.user.username} initiated deleting question ${req.params.questionId)}')
    domain.Question.findByIdAndRemoveAsync(req.params.questionId)
      .then(function () {
        logger.info('Question ${req.params.questionId)} is now deleted')
        next()
      })
  },

  function removeUserAskedReferences (req, res, next) {
    var query = {'profile.asked': { $elemMatch: { $eq: req.params.questionId} } }
    var action = {'$pull': { 'profile.asked': ObjectId(req.params.questionId) } }
    logger.info('Deleting users asked references to ${req.params.questionId)}')
    domain.User.updateAsync(query, action)
      .then(function () {
        logger.info('Users asked references to ${req.params.questionId)} are now deleted')
        next()
      })
  },

  function removeUserAnsweredReferences (req, res, next) {
    var query = {'profile.answered': { $elemMatch: { $eq: req.params.questionId} } }
    var action = {'$pull': { 'profile.answered': ObjectId(req.params.questionId) } }
    logger.info('Deleting users answered references to ${req.params.questionId)}')
    domain.User.updateAsync(query, action)
      .then(function () {
        logger.info('Users answered references to ${req.params.questionId)} are now deleted')
        next()
      })
  },

  function removeUserKarmaChangesReferences (req, res, next) {
    var query = { 'profile.karmaChanges': {$elemMatch: {question: {$eq: req.params.questionId}}}}
    var action = {'$pull': { 'profile.karmaChanges': { question: ObjectId(req.params.questionId) } } }
    logger.info('Deleting users karmaChanges referencing ${req.params.questionId)}')
    domain.User.updateAsync(query, action)
      .then(function () {
        logger.info('Users karmaChanges referencing ${req.params.questionId)} are now deleted')
        next()
      })
  },

  function removeUserFeedReferences (req, res, next) {
    var query = { questionNotifications: {$elemMatch: {question: {$eq: req.params.questionId}}}}
    var action = {'$pull': { 'questionNotifications': { question: ObjectId(req.params.questionId) } } }
    logger.info('Deleting userfeed entries referencing ${req.params.questionId)}')
    domain.UserFeed.updateAsync(query, action)
      .then(function () {
        logger.info('Userfeed entries referencing ${req.params.questionId)} are now deleted')
        res.send()
      })
  },

  function finishDeletion (req, res) {
    logger.info('All references to ${req.params.questionId)} are now deleted')
    res.send()
  })

module.exports = router
