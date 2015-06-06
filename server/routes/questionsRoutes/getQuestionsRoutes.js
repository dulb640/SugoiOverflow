'use strict';

var express     = require('express');
var router      = express.Router();

var domain      = require('../../domain');
var logger      = require('../../logger');
var middleWares = require('./middleWares');

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
    .populate('author subscribers answers.author', 'profile username displayName email')
    .execAsync()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
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
    .findByIdAsync(req.user.id)
    .then(function(user){
      var tags = user.profile.selectedTags;
      domain.Question
        .find({'tags': {$in : tags}})
        .select('id title body answers.author answers.timestamp answers.correct subscribers tags timestamp author')
        .populate('author subscribers answers.author', 'profile username displayName email')
        .execAsync()
        .then(function(questions){
          res
            .status(200)
            .send(questions);
          next();
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
    .aggregateAsync([{
        $match:{ 'answers.correct': {$ne: true}}}, {
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
    .then(function(questions){
      domain.User.populateAsync(questions, {path:'author subscribers answers.author', select: 'profile username displayName email'})
        .then(function(populatedQuestions){
          populatedQuestions.forEach(function(q){
            q.id = q._id;
            delete q._id;
          });

          res
            .status(200)
            .send(populatedQuestions);
          next();
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
router.get('/one/:questionId',

  middleWares.getQuestion,

  function sendQuestion(req, res, next){
    req.question
      .populateAsync('author subscribers upVotes downVotes answers.author comments.author answers.comments.author', 'profile username displayName email feed')
      .then(function(question){
        res
          .status(200)
          .send(question);
        next();
      })
      .catch(function(error){
        logger.error('Error getting question', error);
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
    .execAsync()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
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
    .execAsync()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
      next();
    })
    .catch(function(error){
      logger.error('Error getting questions by tag', error);
      return next(error);
    });
});

module.exports = router;
