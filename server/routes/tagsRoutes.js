'use strict';

var domain = require('../domain');
var _      = require('lodash');
var express = require('express');
var router  = express.Router();
var logger      = require('../logger');


router.get('/top', function(req, res, next){

  var mapReduceOptions = {
    /* jshint ignore:start */
    map: function(){
      this.tags.forEach(function(tag){
        emit(tag, 1);
      });
    },
    reduce:function(key, values){
      return values.length;
    },
    limit:100,
    out: {
      inline: 1,
      reduce: 'questionsTagsTotal'
    }
    /* jshint ignore:end */
  };

  domain.Question
    .mapReduceQ(mapReduceOptions)
    .then(function(results){
      var tags = _.chain(results)
        .map(function(result){
          return {
            text: result._id,
            count: result.value
          };
        })
        .sortByOrder('count', false)
        .value();

      res
        .status(200)
        .send(tags);
    })
    .catch(function(error){
      logger.error('Error getting top tags', error);
      return next(error);
    });
});


module.exports = router;
