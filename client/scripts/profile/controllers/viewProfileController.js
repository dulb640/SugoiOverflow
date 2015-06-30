/* global angular*/
angular.module('sugoiOverflow.profile')
  .controller('viewProfileController',
    function ($scope, $q, $routeParams, tagsDataService, profilesDataService, questionsDataService) {
      'use strict'

      window._.extend($scope, {
        isOwnProfile: false,
        user: {},
        tags: [],
        questions: []
      })

      function mapTags (questions) {
        window._.each(questions, function (question) {
            question.tags = window._.map(question.tags, function (tag) {
              return {
                text: tag
              }
            })
          })
        return questions
      }

      function loadUser (user) {
        $scope.displayName = user.displayName
        $scope.username = user.username
        $scope.email = user.email
        $scope.tags = window._.map(user.profile.selectedTags, function mapTags (tag) {
          return {
            text: tag
          }
        })
        $scope.location = user.profile.location
        $scope.karma = user.profile.karma

        var getAskedPromise = questionsDataService.getQuestionsAskedByUser(user.username)
          .then(function (questions) {
            $scope.asked = mapTags(questions)
          })

        var getAnsweredPromise = questionsDataService.getQuestionsAnsweredByUser(user.username)
          .then(function (questions) {
            $scope.answered = mapTags(questions)
          })

        var getSubscribedPromise = questionsDataService.getQuestionsSubscribedByUser(user.username)
          .then(function (questions) {
            $scope.subcribed = mapTags(questions)
          })

        return $q.all([getAskedPromise, getAnsweredPromise, getSubscribedPromise])
      }

      if (!$routeParams.username || $routeParams.username === 'me') {
        profilesDataService.getCurrentUserProfile()
          .then(loadUser)
          .then(function () {
            $scope.isOwnProfile = true
          })
      } else {
        profilesDataService.getUser($routeParams.username)
          .then(loadUser)
          .then(function () {
            $scope.isOwnProfile = false
          })
      }
    }
  )
