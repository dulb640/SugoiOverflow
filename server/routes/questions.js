'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var _           = require('lodash');
var secureRoute = require('../secureRoute');
var Router  = require('koa-router');
var router  = new Router();

router.use(secureRoute);
router.get('/', function *(){
  var self = this;
  domain.Question
    .find()
    .select('title text answers tags timestamp user')
    .execQ()
    .then(function(questions){
      self.response.status = 200;
      self.response.body = questions;
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      self.response.status = 500;
    });
});

router.get('/search/:term', function *(){
  var self = this;
  domain.Question
    .find(
        { $text : { $search : self.params.term } },
        { score : { $meta: 'textScore' } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .select('text tags added')
    .execQ()
    .then(function(questions){
      self.response.status = 200;
      self.response.body = questions;
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      self.response.status = 500;
    });
});

router.get('/tag/:tag', function *(){
  var self = this;
  domain.Question
    .find(
      { tags : self.params.tag }
    )
    .select('text tags added')
    .execQ()
    .then(function(questions){
      self.response.status = 200;
      self.response.body = questions;
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      self.response.status = 500;
    });
});

router.post('/:id/answer/', function *(){
  var self = this;
  domain.Question.findByIdQ(self.params.id)
    .then(function (question){
      var answer = new domain.Answer({
        user: self.user._id,
        text: self.body.text,
        tags: self.body.tags
      });

      question.answers.push(answer);

      return question.saveQ();
    })
    .then(function(questions){
      self.response.status = 200;
      self.response.body = questions;
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      self.response.status = 500;
    });
});

router.post('/', function *(){
  var self = this;
  new domain.Question(_.extend(self.request.body, {user: self.user._id}))
    .saveQ()
    .then(function(questions){
      self.response.status = 200;
      self.response.body = questions;
    })
    .catch(function(error){
      logger.error('Error getting questions', error);
      self.response.status = 500;
    });
});


module.exports = router;