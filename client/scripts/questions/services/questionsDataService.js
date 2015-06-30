/* global angular*/
 /**
  * @function questionsDataService
  * @memberOf sugoiOverflow.questions
  * @description Questions data service.
  */
angular.module('sugoiOverflow.questions')
  .factory('questionsDataService',
  function ($http, $q) {
    'use strict'

    var service = {
      getAllQuestionsList: function () {
        var deferred = $q.defer()
        $http.get('/api/questions/')
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getSuggestedQuestionsList: function () {
        var deferred = $q.defer()
        $http.get('/api/questions/suggested')
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getMostWantedQuestionsList: function () {
        var deferred = $q.defer()
        $http.get('/api/questions/most-wanted')
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getQuestionsAskedByUser: function (username) {
        var deferred = $q.defer()
        $http.get(window.s.sprintf('/api/questions/profile/%s/asked', username))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getQuestionsAnsweredByUser: function (username) {
        var deferred = $q.defer()
        $http.get(window.s.sprintf('/api/questions/profile/%s/answered', username))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getQuestionsSubscribedByUser: function (username) {
        var deferred = $q.defer()
        $http.get(window.s.sprintf('/api/questions/profile/%s/subscribed', username))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getQuestionsListSearch: function (terms) {
        var deferred = $q.defer()
        $http.get(window.s.sprintf('/api/questions/search/%s', terms))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },

      getQuestion: function (id) {
        var deferred = $q.defer()
        $http.get(window.s.sprintf('/api/questions/one/%s', id))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },
      addQuestion: function (question) {
        var deferred = $q.defer()
        $http.post('/api/questions/', question)
          .success(function (addedQuestion) {
            deferred.resolve(addedQuestion)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },
      subscribeToQuestion: function (questionId) {
        var deferred = $q.defer()
        $http.put(window.s.sprintf('/api/questions/%s/subscribe', questionId))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },
      addAnswer: function (questionId, answer) {
        var deferred = $q.defer()
        var data = {
          body: answer
        }
        $http.post(window.s.sprintf('/api/questions/%s/answer', questionId), data)
          .success(function (responseData) {
            deferred.resolve(responseData)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },

      addQuestionComment: function (questionId, comment) {
        var deferred = $q.defer()
        var data = {
          body: comment
        }

        $http.post(window.s.sprintf('/api/questions/%s/comment', questionId), data)
          .success(function (responseData) {
            deferred.resolve(responseData)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },
      addAnswerComment: function (questionId, answerId, comment) {
        var deferred = $q.defer()
        var data = {
          body: comment
        }
        $http.post(window.s.sprintf('/api/questions/%s/answer/%s/comment', questionId, answerId), data)
          .success(function (responseData) {
            deferred.resolve(responseData)
          })
          .error(function (error) {
            deferred.reject(error)
          })
        return deferred.promise
      },
      upvoteAnswer: function (questionId, answerId) {
        var deferred = $q.defer()
        $http.put(window.s.sprintf('/api/questions/%s/answer/%s/upvote', questionId, answerId))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },
      downvoteAnswer: function (questionId, answerId) {
        var deferred = $q.defer()
        $http.put(window.s.sprintf('/api/questions/%s/answer/%s/downvote', questionId, answerId))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      },
      markAnswerAsCorrect: function (questionId, answerId) {
        var deferred = $q.defer()
        $http.put(window.s.sprintf('/api/questions/%s/answer/%s/correct', questionId, answerId))
          .success(function (data) {
            deferred.resolve(data)
          })
          .error(function (error) {
            deferred.reject(error)
          })

        return deferred.promise
      }
    }
    return service
  })
