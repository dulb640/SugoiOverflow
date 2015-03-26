'use strict';

var domain = require('../domain');
var _      = require('lodash');
var express = require('express');
var gramophone = require('gramophone');
var router  = express.Router();
var logger      = require('../logger');


router.post('/tags', function(req, res, next){
  var text = req.body.question;
  //bad bad bad bad sync call
  var words = gramophone.extract(text, {limit: 6, min: 2});
  var search = words.join(' ');
  domain.Question
    .find(
        { $text : { $search : search } },
        { score : { $meta: 'textScore' } },
        { limit: 5 }
    )
    .select('tags')
    .execQ()
    .then(function(questions){
      var tags = _.chain(questions)
                  .map(function(q) {return q.tags;})
                  .flatten()
                  .uniq()
                  .value();
      res
        .status(200)
        .send(tags);
    })
    .catch(function(error){
      logger.error('Error getting tags suggestion', error);
      return next(error);
    });
});

router.post('/people', function(req, res, next){
  var text = req.body.question;
  //bad bad bad bad sync call
  var words = gramophone.extract(text, {limit: 6, min: 2});
  var search = words.join(' ');
  domain.Question
    .find(
        { $text : { $search : search },
          'answers': {
            $all: [{
                $elemMatch: {
                  correct: {$eq: true}
                }
              }
            ]
          }
        },
        { score : { $meta: 'textScore' } },
        { limit: 5 }
    )
    .select('answers')
    .populate('answers.author', 'name email id')
    .execQ()
    .then(function(questions){
      var people = _.chain(questions)
                  .map(function(q) {
                    var correctAnswers = _.filter(q.answers, function(x){return x.correct;});
                    return correctAnswers;
                  })
                  .flatten()
                  .pluck('author')
                  .uniq()
                  .value();
      res
        .status(200)
        .send(people);
    })
    .catch(function(error){
      logger.error('Error getting people suggestion', error);
      return next(error);
    });
});


module.exports = router;
