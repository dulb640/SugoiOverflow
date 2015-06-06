'use strict';

var domain = require('../../domain');
var errors = require('../../errors');

function getQuestion(req, res, next){
  return domain.Question.findByIdAsync(req.params.questionId)
  .then(function(question) {
    if(!question){
      return next(new errors.NotFoundError('Question was not found'));
    }
    req.question = question;
    next();
  });
}

function saveQuestionAndSend(req, res, next) {
  req.question.saveAsync()
    .then(function(savedQuestion) {
      return domain.Question.populateAsync(savedQuestion, {
        path: 'author subscribers upVotes downVotes answers.author comments.author answers.comments.author',
        select: 'profile username displayName email'
      });
    })
    .then(function(populatedQuestion){
      populatedQuestion = populatedQuestion[0];//TODO: figure why is it returned as array
      res
        .status(200)
        .send(populatedQuestion);

      req.question = populatedQuestion;
      next();
    })
    .catch(function(er){
      return next(new errors.GenericError('Error posting comment', er));
    });
}

function getUserByUsername(req, res, next) {
  return domain.User.findOneAsync({username:req.params.username})
    .then(function(foundUser) {
      if(!foundUser){
        return next(new errors.NotFoundError('User was not found'));
      }
      req.foundUser = foundUser;
      next();
    });
}

function getAnswer(req, res, next) {
  var answer = req.question.answers.id(req.params.answerId);
  if(!answer){
    return next(new errors.NotFoundError('Answer was not found'));
  }
  req.answer = answer;
  next();
}

module.exports = {
  getQuestion:         getQuestion,
  getAnswer:           getAnswer,
  saveQuestionAndSend: saveQuestionAndSend,
  getUserByUsername :  getUserByUsername
};
