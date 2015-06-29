'use strict'

/**
 * @apiDefine QuestionSuccess
 * @apiSuccess {string}     id                                     Id of a question
 * @apiSuccess {string}     title                                  Title of a question
 * @apiSuccess {object[]}   body                                   Body of a question
 * @apiSuccess {object}     author                                 Author of a question
 * @apiSuccess {string}     author.username                        Question's author's username
 * @apiSuccess {string}     author.email                           Question's author's email
 * @apiSuccess {string}     author.displayName                     Question's author's display name
 * @apiSuccess {number}     author.profile                         Question's author's profile
 * @apiSuccess {number}     author.profile.karma                   Question's author's karma
 * @apiSuccess {object[]}   answers                                Answers to question
 * @apiSuccess {bool}       answers.correct                        Is answer marked as correct
 * @apiSuccess {date}       answers.timestamp                      Date and time of an answer
 * @apiSuccess {number}     answers.score                          Score of an answer
 * @apiSuccess {object}     answers.author                         Author of a answer
 * @apiSuccess {string}     answers.author.username                Answer's author's username
 * @apiSuccess {string}     answers.author.email                   Answer's author's email
 * @apiSuccess {string}     answers.author.displayName             Answer's author's display name
 * @apiSuccess {number}     answers.author.profile                 Answer's author's profile
 * @apiSuccess {number}     answers.author.profile.karma           Answer's author's karma
 * @apiSuccess {object[]}   subscribers                            Users subscribed to question
 * @apiSuccess {string}     subscribers.username                   Subscriber's username
 * @apiSuccess {string}     subscribers.email                      Subscriber's email
 * @apiSuccess {string}     subscribers.displayName                Subscriber's display name
 * @apiSuccess {number}     subscribers.profile                    Subscriber's profile
 * @apiSuccess {number}     subscribers.profile.karma              Subscriber's karma
 * @apiSuccess {date}       timestamp                              Date and time when question was asked
 * @apiSuccess {string[]}   tags                                   Tags assigned to question
 */
var express = require('express')

var router = express.Router()
router.use(require('./getQuestionsRoutes'))
router.use(require('./getQuestionsForProfileRoutes'))
router.use(require('./addOrUpdateQuestionRoutes'))
router.use(require('./addOrUpdateAnswerRoutes'))

module.exports = router
