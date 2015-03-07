'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express     = require('express');
var router      = express.Router();

/**
 * Get all questions
 */
router.get('/', function(req, res){
  domain.Question
    .find()
    .select('title text answers tags timestamp user')
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Get question by id
 */
router.get('/:id', function(req, res){
  domain.Question.findByIdQ(req.params.id)
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error getting answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Fulltext search for questions
 */
router.get('/search/:term', function(req, res){
  domain.Question
    .find(
        { $text : { $search : req.params.term } },
        { score : { $meta: 'textScore' } }
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
      res
        .status(500)
        .send();
    });
});

/**
 * Get questions by tag
 */
router.get('/tag/:tag', function(req, res){
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
      res
        .status(500)
        .send();
    });
});

/**
 * Add answer
 */
router.post('/:questionId/answer/', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = new domain.Answer({
        user: req.user._id,
        text: req.body.text
      });

      question.answers.push(answer);

      return question.saveQ();
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
      });
    })
    .catch(function(error){
      logger.error('Error posting answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Mark answer as correct
 */
router.put('/:questionId/answer/:answerId/correct', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      answer.correct = true;
      return question.saveQ();
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error marking answer as correct', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Upvote answer
 */
router.put('/:questionId/answer/:answerId/upvote', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      answer.upVotes.push(req.user.id);
      return question.saveQ();
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Downvote answer
 */
router.put('/:questionId/answer/:answerId/downvote', function(req, res){
  domain.Question.findByIdQ(req.params.questionId)
    .then(function (question){
      var answer = question.answers.id(req.params.answerId);
      answer.downVotes.push(req.user.id);
      return question.saveQ();
    })
    .then(function(question){
      res
        .status(200)
        .send(question);
    })
    .catch(function(error){
      logger.error('Error upvoting an answer', error);
      res
        .status(500)
        .send();
    });
});

/**
 * Add question
 */
router.post('/', function(req, res){
  new domain.Question(_.extend(req.body, {user: req.user._id}))
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
      });
    })
    .catch(function(error){
      logger.error('Error posting question', error);
      res
        .status(500)
        .send();
    });
});


module.exports = router;
