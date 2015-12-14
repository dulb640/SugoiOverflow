/* global angular*/
angular.module('sugoiOverflow.questions')
  .controller('newQuestionController',
    function ($scope, $location, questionsDataService, profilesDataService) {
      'use strict'
      window._.extend($scope, {
        user: {},
        title: '',
        body: '',
        tags: [],
        people: [],

        submitNewQuestion: function () {
          var newQuestion = {
            title: $scope.title,
            body: $scope.body,
            tags: window._.pluck($scope.tags, 'text'),
            people: window._.pluck($scope.people, '_id')
          }
          questionsDataService.addQuestion(newQuestion)
            .then(function (addedQuestion) {
              $location.path(window.s.sprintf('/questions/%s/answers', addedQuestion.id))
            })
        }
      })

      profilesDataService.getCurrentUserProfile()
        .then(function (user) {
          $scope.user = user
        })
    }
  )
