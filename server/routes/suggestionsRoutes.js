'use strict';

var domain = require('../domain');
var _      = require('lodash');
var express = require('express');
var gramophone = require('gramophone');
var router  = express.Router();
var logger      = require('../logger');


router.post('/tags', function(req, res){
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
      res
        .status(500)
        .send();
    });

});


module.exports = router;
