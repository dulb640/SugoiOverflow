'use strict';

var domain = require('../domain');
var _      = require('lodash');
var express = require('express');
var router  = express.Router();
var logger      = require('../logger');


router.get('/top', function(req, res, next){

  var mapReduceOptions = {
    //have to disable eslint because mapreduce is executed on mongodb server
    /*eslint-disable */
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
    /*eslint-enable */
  };

  domain.Question
    .mapReduceQ(mapReduceOptions)
    .then(function(results){
      if(results.length === 0 ){
        return res
          .status(200)
          .send([]);
      }

      var tags = _.chain(results)
        .filter(function(result){
          return result;
        })
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
