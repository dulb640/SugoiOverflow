'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express     = require('express');
var validate    = require('express-jsonschema').validate;
var router      = express.Router();
var schemas     = require('./schemas');


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

/**
 * @apiName GetAllQuestions
 * @api {get} /api/questions/
 * @apiDescription Get all questions
 * @apiGroup Questions
 * @apiUse QuestionSuccess
 */
router.get('/', function(req, res, next){
  domain.Question
    .find()
    .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
    .populate('author subscribers answers.author', 'username displayName email')
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      return next(error);
    });
});

/**
 * @apiName GetSuggestedQuestions
 * @api {get} /api/questions/suggested
 * @apiDescription Get a list of suggested questions
 * @apiGroup Questions
 * @apiUse QuestionSuccess
 */
router.get('/suggested', function(req, res, next){
  domain.User
    .findByIdQ(req.user.id)
    .then(function(user){
      var tags = user.profile.selectedTags;
      domain.Question
        .find({'tags': {$in : tags}})
        .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
        .populate('author subscribers answers.author', 'username displayName email')
        .execQ()
        .then(function(questions){
          res
            .status(200)
            .send(questions);
        })
        .catch(function(error){
          logger.error('Error getting questions', error);
          return next(error);
        });
    });
});

/**
 * @apiName GetMostWantedQuestions
 * @api {get} /api/questions/most-wanted
 * @apiDescription Get a list of most wanted(subscribed) questions
 * @apiGroup Questions
 * @apiUse QuestionSuccess
 */
router.get('/most-wanted', function(req, res, next){
  domain.Question
    .aggregate([{
        $match:{ 'answers.correct': {$ne: true}}},{
        $project : {
          subCount: {
            $size: {
              '$ifNull': [ '$subscribers', [] ]
            }
          },
          id : 1,
          author : 1,
          title : 1,
          body : 1,
          'answers.author' : 1,
          'answers.correct' : 1,
          'answers.timestamp' : 1,
          timestamp : 1,
          subscribers : 1,
          tags : 1
        }
      },
      {$sort: {'subCount':-1} }])
    .execQ()
    .then(function(questions){
      domain.User.populateQ(questions, {path:'author subscribers answers.author', select: 'username displayName email'})
        .then(function(questions){
          questions.forEach(function(q){
            q.id = q._id;
            delete q._id;
          });

          res
            .status(200)
            .send(questions);
        });
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      return next(error);
    });
});

/**
 * @apiName GetAllQuestionsForUser
 * @api {get} /api/questions/profile/:username
 * @apiParam {string} username User's username
 * @apiDescription Get a list of questions asked by user
 * @apiGroup Questions
 * @apiUse QuestionSuccess
 */
router.get('/profile/:username', function(req, res, next){
  domain.User
    .findOneQ({username:req.params.username})
    .then(function(user){
      return user.populateQ('profile.asked', 'id title body answers.author answers.timestamp answers.correct subscribers tags timestamp')
        .then(function(user){
          res
            .status(200)
            .send(user.profile.asked);
        });
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      return next(error);
    });
});


/**
 * Get question by id
 */
router.get('/:id', function(req, res, next){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      return next(error);
    });
});

/**
 * Fulltext search for questions
 */
router.get('/search/:term', function(req, res, next){
  domain.Question
    .find(
        { $text : { $search : req.params.term } },
        { score : { $meta: 'textScore' } },
        { limit: 50 }
    )
    .sort({ score : { $meta : 'textScore' } })
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      return next(error);
    });
});

/**
 * Get questions by tag
 */
router.get('/tag/:tag', function(req, res, next){
  domain.Question
    .find(
      { tags : req.params.tag }
    )
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions by tag', error);
      return next(error);
    });
});

function updateUserQuestionsFeed(user, question, message){
  return user.populateQ('feed', 'questionNotifications')
    .then(function(user){
      user.feed.questionNotifications.push({
        body:message,
        question: question.id,
        questionTitle: question.title
      });
      return user.feed.saveQ()
        .catch(function(error){
          logger.error('Error updating user feed', error);
        });
    });
}

/**
 * Add answer
 */
router.post('/:questionId/answer', validate({body: schemas.addOrEditAnswerSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = new domain.Answer({
        author: req.user.id,
        body: req.body.body
      });

      question.answers.push(answer);

      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.answered.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);


        question.populateQ('subscribers', 'feed')
          .then(function(questionPop){
            questionPop.subscribers.forEach(function(sub){
              if (sub.id !== req.user.id){
                updateUserQuestionsFeed(sub, question, 'Question has been answered');
              }
            });
          });
      });
    })
    .then(function(question){
        res
          .status(200)
          .send(question);
    })
    .catch(function(error){
      logger.error('Error posting answer', error);
      return next(error);
    });
});


/* Add comment for question */
router.post('/:questionId/comment', validate({body: schemas.addOrEditCommentSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
  .then(function(question) {
    question.comments.push({
      author: req.user.id,
      body: req.body.body
    });
    return question.saveQ();
  })
  .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
  .then(function(question){
    return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
  })
  .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.answered.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);

        question.populateQ('subscribers', 'feed')
          .then(function(questionPop){
            questionPop.subscribers.forEach(function(sub){
              updateUserQuestionsFeed(sub, question, 'Question has new comment');
            });
          });
      });
    })
    .then(function(question){
        res
          .status(200)
          .send(question);
    })
    .catch(function(error){
      logger.error('Error posting comment', error);
      return next(error);
    });
});


/* Add comment for answer */
router.post('/:questionId/answer/:answerId/comment', validate({body: schemas.addOrEditCommentSchema}), function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      if(!answer){
        res
        .status(404);

        return;
      }

      answer.comments.push({
        author: req.user.id,
        body: req.body.body
      });

      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error adding comment', error, error.errors);
      return next(error);
    });
});

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      return question.populateQ('answers.author', 'username displayName email profile.karmaChanges feed')
        .then(function(question){
          var answer = question.answers.id(req.params.answerId);
          answer.correct = true;
          answer.author.profile.karmaChanges.push({
            value: 5,
            reason: 'Answer marked as correct',
            question: question.id
          });

          return answer.author.saveQ()
            .then(function(author){
              return updateUserQuestionsFeed(author, question, 'Your answer marked as correct');
            })
            .then(function(){
              return question.saveQ();
            });
        });
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error marking answer as correct', error);
      return next(error);
    });
});

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      var downVoteIndex = answer.downVotes.indexOf(req.user.id);
      if (downVoteIndex > -1){
        answer.downVotes.splice(downVoteIndex, 1);
      }
      else if (answer.upVotes.indexOf(req.user.id) === -1){
        answer.upVotes.push(req.user.id);
      }
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      return next(error);
    });
});

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote', function(req, res, next){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      var upVoteIndex = answer.upVotes.indexOf(req.user.id);
      if (upVoteIndex > -1){
        answer.upVotes.splice(upVoteIndex, 1);
      }
      else if (answer.downVotes.indexOf(req.user.id) === -1){
        answer.downVotes.push(req.user.id);
      }
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      return next(error);
    });
});

/**
 * Subscribe to question
 */
router.put('/:id/subscribe', function(req, res, next){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      question.subscribers.push(req.user.id);
      return question.saveQ();
    })
    .then(function(question){
      return question.populateQ('author subscribers upVotes downVotes', 'username displayName email');
    })
    .then(function(question){
      return question.populateQ('answers.author comments.author answers.comments.author', 'username displayName email');
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      return next(error);
    });
});

/**
 * Add question
 */
router.post('/', validate({body: schemas.addOrEditQuestionSchema}), function(req, res, next){
  var question = new domain.Question(_.extend(req.body, {author: req.user.id}));
  question.subscribers.push(req.user.id);

  question
    .saveQ()
    .then(function(question){
      return domain.User.findByIdQ(req.user.id)
      .then(function(user){
        user.profile.asked.push(question.id);
        return user.saveQ();
      })
      .then(function(){
        res
          .status(200)
          .send(question);

        question.populateQ('proposedPeople', 'feed')
          .then(function(questionPop){
            questionPop.proposedPeople.forEach(function(prop){
              updateUserQuestionsFeed(prop, question, 'You have been proposed to answer the question');
            });
          });
      });
    })
    .catch(function(error){
      logger.error('Error posting question', error, error.errors);
      next(error);
    });
});


module.exports = router;
