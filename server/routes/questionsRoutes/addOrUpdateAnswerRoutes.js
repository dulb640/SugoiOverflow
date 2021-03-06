'use strict'

var domain = require('../../domain')

var express = require('express')
var validate = require('express-jsonschema').validate
var Promise = require('bluebird')

var router = express.Router()
var schemas = require('../schemas')
var middleWares = require('./middleWares')
var userService = require('../../services/userService')
var roles = require('../roles')

/**
 * Add answer
 */
router.post('/:questionId/answer',

  validate({body: schemas.addOrEditAnswerSchema}),

  middleWares.getQuestion,

  function createAnswer (req, res, next) {
    var answer = new domain.Answer({
      author: req.user.id,
      body: req.body.body
    })

    req.question.answers.push(answer)
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateUserQuestionsFeed (req, res, next) {
    req.user.profile.answered.push(req.question.id)
    req.user.saveAsync()
      .then(function () {
        if (!req.question.subscribers) {
          return
        }
        var promises = req.question.subscribers
          .filter(function (sub) {
            return sub.id !== req.user.id
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has a new answer')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  })

/**
 * Edit answer
 */
router.put('/:questionId/answer/:answerId',

  validate({body: schemas.addOrEditAnswerSchema}),

  middleWares.getQuestion,

  middleWares.getAnswer,

  function (req, res, next) {
    req.answer.body = req.body.body
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateUserQuestionsFeed (req, res, next) {
    req.user.saveAsync()
      .then(function () {
        if (!req.question.subscribers) {
          return
        }
        var promises = req.question.subscribers
          .filter(function (sub) {
            return sub.id !== req.user.id
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Question has an edited answer')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  }
)

/* Delete answer */
router.delete('/:questionId/answer/:answerId',

  /*roles(['moderator', 'admin']),*/

  function deleteAnswer (req, res, next) {
    var query = { '_id': req.params.questionId }
    var action = {'$pull': { 'answers': { _id: req.params.answerId } } }
    domain.Question.updateAsync(query, action)
      .then(function () {
        next()
      })
  },

  middleWares.getQuestion,

  middleWares.saveQuestionAndSend,
)

/* Add comment to answer */
router.post('/:questionId/answer/:answerId/comment',

  validate({body: schemas.addOrEditCommentSchema}),

  middleWares.getQuestion,

  middleWares.getAnswer,

  function addComment (req, res, next) {
    req.answer.comments.push({
      author: req.user.id,
      body: req.body.body
    })
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateFeed (req, res, next) {
    userService.updateQuestionsFeed(req.answer.author, req.question, 'Answer has a new comment')
      .then(function () {
        next()
      })
  }
)

/* Edit comment on answer */
router.put('/:questionId/answer/:answerId/comment/:commentId',

  validate({body: schemas.addOrEditCommentSchema}),

  middleWares.getQuestion,

  middleWares.getAnswer,

  middleWares.getAnswerComment,

  function (req, res, next) {
    req.comment.body = req.body.body
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateFeed (req, res, next) {
    userService.updateQuestionsFeed(req.answer.author, req.question, 'Answer has an edited comment')
      .then(function () {
        next()
      })
  }
)

/* Delete comment on answer */
router.delete('/:questionId/answer/:answerId/comment/:commentId',

  middleWares.getQuestion,

  middleWares.getAnswer,

  function (req, res, next) {
    req.answer.comments = req.answer.comments.filter(function (comment) {
      return comment._id != req.params.commentId
    })
    next()
  },

  middleWares.saveQuestionAndSend
)

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct',
  middleWares.getQuestion,

  middleWares.getAnswer,

  function markAnswerAsCorrect (req, res, next) {
    req.answer.correct = true
    next()
  },

  middleWares.saveQuestionAndSend,

  function updateFeed (req, res, next) {
    userService.updateQuestionsFeed(req.answer.author, req.question, 'Your answer marked as correct', 5)
      .then(function () {
        if (!req.question.subscribers) {
          return
        }
        var promises = req.question.subscribers
          .filter(function (sub) {
            return (sub.id !== req.user.id && sub.id !== req.answer.author)
          })
          .map(function (sub) {
            return userService.updateQuestionsFeed(sub, req.question, 'Answer has been marked as correct')
          })
        return Promise.all(promises)
      })
      .then(function () {
        next()
      })
  }
)

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote',
  middleWares.getQuestion,

  middleWares.getAnswer,

  function upvote (req, res, next) {
    if (req.answer.downVotes.indexOf(req.user.id) !== -1) {
      req.answer.downVotes.remove(req.user.id)
    }

    if (req.answer.upVotes.indexOf(req.user.id) === -1) {
      req.answer.upVotes.push(req.user.id)
      req.isUpvoted = true
    }

    next()
  },

  middleWares.saveQuestionAndSend,

  function updateFeed (req, res, next) {
    if (!req.isUpvoted) {
      return next()
    }

    userService.updateQuestionsFeed(req.answer.author, req.question, 'Answer was upvoted', 1)
      .then(function () {
        next()
      })
  }
)

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote',
  middleWares.getQuestion,

  middleWares.getAnswer,

  function downvote (req, res, next) {
    if (req.answer.upVotes.indexOf(req.user.id) !== -1) {
      req.answer.upVotes.remove(req.user.id)
    }

    if (req.answer.downVotes.indexOf(req.user.id) === -1) {
      req.answer.downVotes.push(req.user.id)
      req.isDownvoted = true
    }

    next()
  },

  middleWares.saveQuestionAndSend,

  function updateFeed (req, res, next) {
    if (!req.isDownvoted) {
      return next()
    }

    userService.updateQuestionsFeed(req.answer.author, req.question, 'Answer was downvoted', -1)
      .then(function () {
        next()
      })
  }
)

module.exports = router
