angular.module('sugoiOverflow.services')
  .factory('questionsDataService',
  function($http, $q){
    'use strict';

    function mapTag(tag){
      return{
        text: tag
      };
    }

    function mapQuestionForList(question){
      return {
        questionId:  question.id,
        title:       question.title,
        answerCount: question.answers.length,
        subCount:    question.subscribers.length,
        tags:        _.map(question.tags, mapTag)
      };
    }

    function mapAnswer(answer){
      return{
        id:         answer.id,
        downVotes:  answer.downVotes,
        upVotes:    answer.upVotes,
        score:      answer.upVotes.length - answer.downVotes.length,
        body:       answer.text,
        correct:    answer.correct,
        timestamp:  answer.timestamp
      };
    }

    function mapQuestionForDisplay(question){
      return {
        questionId: question.id,
        title: question.title,
        body: question.text,
        answerCount: question.answers.length,
        subCount: question.subscribers.length,
        user: question.user,
        timestamp:  question.timestamp,
        tags: _.map(question.tags, mapTag),
        answers: _.map(question.answers, mapAnswer)
      };
    }

    var service = {
      getQuestionsList: function(){
        var deferred = $q.defer();
        $http.get('/api/questions/')
        .success(function(data){
          var questions = _.map(data, mapQuestionForList);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getQuestion: function(id) {
        var deferred = $q.defer();
        $http.get(_.str.sprintf('/api/questions/%s', id))
        .success(function(data){
          var question = mapQuestionForDisplay(data);
          deferred.resolve(question);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      }

    };
    return service;
  });


