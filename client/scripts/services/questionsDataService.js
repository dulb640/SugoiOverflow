angular.module('sugoiOverflow.services')
  .factory('questionsDataService',
  function($http, $q){
    'use strict';

    function mapTagForClient(tag){
      return{
        text: tag
      };
    }

    function mapTagForApi(tag){
      return tag.text;
    }

    function mapQuestionForList(question){
      return {
        questionId:  question.id,
        title:       question.title,
        answerCount: question.answers.length,
        subCount:    question.subscribers.length,
        tags:        _.map(question.tags, mapTagForClient)
      };
    }

    function mapAnswerForClient(answer){
      return{
        id:         answer.id,
        downVotes:  answer.downVotes,
        upVotes:    answer.upVotes,
        score:      answer.upVotes.length - answer.downVotes.length,
        body:       answer.body,
        correct:    answer.correct,
        timestamp:  answer.timestamp
      };
    }

    function mapQuestionForClient(question){
      return {
        id: question.id,
        title: question.title,
        body: question.body,
        answerCount: question.answers.length,
        subCount: question.subscribers.length,
        user: question.user,
        timestamp:  question.timestamp,
        tags: _.map(question.tags, mapTagForClient),
        answers: _.map(question.answers, mapAnswerForClient)
      };
    }

    function mapQuestionForApi(question){
      return {
        title: question.title,
        body: question.body,
        tags: _.map(question.tags, mapTagForApi)
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
          var question = mapQuestionForClient(data);
          deferred.resolve(question);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      addQuestion: function(question){
        var deferred = $q.defer();
        var data = mapQuestionForApi(question);
        $http.post('/api/questions/', data)
        .success(function(addedQuestion){
          deferred.resolve(addedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      }
    };
    return service;
  });


