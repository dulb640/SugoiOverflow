/* global angular*/
 /**
  * Questions data service.
  */
angular.module('sugoiOverflow.questions')
  .factory('questionsDataService', function (promisedHttp, profilesDataService) {
    'use strict'

    var service = {
      getAllQuestionsList: function () {
        return promisedHttp('get', '/api/questions/')
      },

      getSuggestedQuestionsList: function () {
        return profilesDataService.getCurrentUserProfile()
          .then(function (user) {
            if (!user.profile.selectedTags || user.profile.selectedTags.length === 0) {
              return []
            }
            var tagsString = user.profile.selectedTags.join(',')
            var url = window.s.sprintf('/api/questions?tags=%s', tagsString)
            return promisedHttp('get', url)
          })
      },

      getMostWantedQuestionsList: function () {
        return promisedHttp('get', '/api/questions?sort=-subCount')
      },

      getQuestionsAskedByUser: function (username) {
        var url = window.s.sprintf('/api/questions/profile/%s/asked', username)
        return promisedHttp('get', url)
      },

      getQuestionsAnsweredByUser: function (username) {
        var url = window.s.sprintf('/api/questions/profile/%s/answered', username)
        return promisedHttp('get', url)
      },

      getQuestionsSubscribedByUser: function (username) {
        var url = window.s.sprintf('/api/questions/profile/%s/subscribed', username)
        return promisedHttp('get', url)
      },

      getQuestionsListSearch: function (terms) {
        var url = window.s.sprintf('/api/questions?search=%s', terms)
        return promisedHttp('get', url)
      },

      getQuestion: function (id) {
        var url = window.s.sprintf('/api/questions/%s', id)
        return promisedHttp('get', url)
      },

      addQuestion: function (question) {
        console.log("addingQuestion:")
        console.log(data)
        return promisedHttp('post', '/api/questions/', question)
      },

      subscribeToQuestion: function (questionId) {
        var url = window.s.sprintf('/api/questions/%s/subscribe', questionId)
        return promisedHttp('put', url)
      },

      addAnswer: function (questionId, answer) {
        var url = window.s.sprintf('/api/questions/%s/answer', questionId)
        var data = {
          body: answer
        }
        return promisedHttp('post', url, data)
      },

      addQuestionComment: function (questionId, comment) {
        var url = window.s.sprintf('/api/questions/%s/comment', questionId)
        var data = {
          body: comment
        }
        return promisedHttp('post', url, data)
      },
      addAnswerComment: function (questionId, answerId, comment) {
        var url = window.s.sprintf('/api/questions/%s/answer/%s/comment', questionId, answerId)
        var data = {
          body: comment
        }
        return promisedHttp('post', url, data)
      },
      upvoteAnswer: function (questionId, answerId) {
        var url = window.s.sprintf('/api/questions/%s/answer/%s/upvote', questionId, answerId)
        return promisedHttp('put', url)
      },
      downvoteAnswer: function (questionId, answerId) {
        var url = window.s.sprintf('/api/questions/%s/answer/%s/downvote', questionId, answerId)
        return promisedHttp('put', url)
      },
      deleteQuestion: function (id) {
        var url = window.s.sprintf('/api/questions/%s', id)
        return promisedHttp('delete', url)
      },
      markAnswerAsCorrect: function (questionId, answerId) {
        var url = window.s.sprintf('/api/questions/%s/answer/%s/correct', questionId, answerId)
        return promisedHttp('put', url)
      },
      reviseAnswer: function(questionId, answerId, answer) {
        var url = window.s.sprintf('/api/questions/%s/answer/%s/', questionId, answerId)
        var data = {
          body: answer
        }
        return promisedHttp('put', url, data)
      },
      reviseQuestion: function(questionId, question) {
        var url = window.s.sprintf('/api/questions/%s/', questionId)
        return promisedHttp('put', url, question)
      }
    }
    return service
  })
