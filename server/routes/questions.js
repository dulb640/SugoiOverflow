'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var express = require('express');
var router  = express.Router();

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

router.get('/search/:term', function(req, res){
  domain.Question
    .find(
        { $text : { $search : req.params.term } },
        { score : { $meta: 'textScore' } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .select('text tags added')
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

router.get('/tag/:tag', function(req, res){
  domain.Question
    .find(
      { tags : req.params.tag }
    )
    .select('text tags added')
    .execQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error getting tag', error);
      res
        .status(500)
        .send();
    });
});

router.post('/:id/answer/', function(req, res){
  domain.Question.findByIdQ(req.params.id)
    .then(function (question){
      var answer = new domain.Answer({
        user: req.user._id,
        text: req.body.text,
        tags: req.body.tags
      });

      question.answers.push(answer);

      return question.saveQ();
    })
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error posting answer', error);
      res
        .status(500)
        .send();
    });
});

router.post('/', function(req, res){
  new domain.Question(_.extend(req.request.body, {user: req.user._id}))
    .saveQ()
    .then(function(questions){
      res
        .status(200)
        .send(questions);
    })
    .catch(function(error){
      logger.error('Error posting question', error);
      res
        .status(500)
        .send();
    });
});


module.exports = router;
