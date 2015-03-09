angular.module('sugoiOverflow.services')
  .factory('questionsDataService',
  function($http, $q, mappingService){
    'use strict';

    var service = {
      getAllQuestionsList: function(){
        var deferred = $q.defer();
        $http.get('/api/questions/')
        .success(function(data){
          var questions = _.map(data, mappingService.mapQuestionForList);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getSuggestedQuestionsList: function(){
        var deferred = $q.defer();
        $http.get('/api/questions/suggested')
        .success(function(data){
          var questions = _.map(data, mappingService.mapQuestionForList);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getMostWantedQuestionsList: function(){
        var deferred = $q.defer();
        $http.get('/api/questions/most-wanted')
        .success(function(data){
          var questions = _.map(data, mappingService.mapQuestionForList);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getQuestionsForUser: function(userId){
        var deferred = $q.defer();
        $http.get(_.str.sprintf('/api/questions/profile/%s', userId))
        .success(function(data){
          var questions = _.map(data, mappingService.mapQuestionForList);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getQuestionsListSearch: function(terms){
        var deferred = $q.defer();
        $http.get(_.str.sprintf('/api/questions/search/%s', terms))
        .success(function(data){
          var questions = _.map(data, mappingService.mapQuestionForList);
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
          var question = mappingService.mapQuestionForClient(data);
          deferred.resolve(question);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      addQuestion: function(question){
        var deferred = $q.defer();
        var data = mappingService.mapQuestionForApi(question);
        $http.post('/api/questions/', data)
        .success(function(addedQuestion){
          deferred.resolve(addedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      subscribeToQuestion: function(questionId){
        var deferred = $q.defer();
        $http.put(_.str.sprintf('/api/questions/%s/subscribe', questionId))
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      addAnswer: function(questionId, answer){
        var deferred = $q.defer();
        var data = {
          body: answer
        };
        $http.post(_.str.sprintf('/api/questions/%s/answer', questionId), data)
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },

      addQuestionComment: function(questionId, comment){
        var deferred = $q.defer();
        var data = {
          body: comment
        };

        $http.post(_.str.sprintf('/api/questions/%s/comment', questionId), data)
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },
      addAnswerComment: function(questionId, answerId, comment){
        var deferred = $q.defer();
         var data = {
          body: comment
        };
         $http.post(_.str.sprintf('/api/questions/%s/answer/%s/comment', questionId, answerId), data)
        .success(function(data){
          var updatedAnswer = mappingService.mapAnswerForClient(data);
          deferred.resolve(updatedAnswer);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },
      upvoteAnswer: function(questionId, answer){
        var deferred = $q.defer();
        $http.put(_.str.sprintf('/api/questions/%s/answer/%s/upvote', questionId, answer.id))
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      downvoteAnswer: function(questionId, answer){
        var deferred = $q.defer();
        $http.put(_.str.sprintf('/api/questions/%s/answer/%s/downvote', questionId, answer.id))
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      },
      markAnswerAsCorrect: function(questionId, answer){
        var deferred = $q.defer();
        $http.put(_.str.sprintf('/api/questions/%s/answer/%s/correct', questionId, answer.id))
        .success(function(data){
          var updatedQuestion = mappingService.mapQuestionForClient(data);
          deferred.resolve(updatedQuestion);
        })
        .error(function(error){
          deferred.reject(error);
        });

        return deferred.promise;
      }
    };
    return service;
  });


