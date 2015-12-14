/* global angular, _*/
angular.module('sugoiOverflow.questions')
  .controller('questionDetailsController',
    function ($scope, $q, $routeParams, $location, questionsDataService, currentUser) {
      'use strict'

      function loadQuestion (question) {
        $scope.questionId = question.id
        $scope.title = question.title
        $scope.body = question.body
        $scope.tags = window._.map(question.tags, function mapTags (tag) {
          return {
            text: tag
          }
        })
        $scope.proposedPeople = window._.map(question.proposedPeople, function mapPeople (tag) {
          return {
            text: proposedPeople
          }
        })
        $scope.author = question.author
        $scope.timestamp = question.timestamp
        $scope.answers = question.answers
        $scope.subscribers = question.subscribers
        $scope.comments = question.comments
        $scope.answer = ''
        $scope.questionComment = ''
      }

      _.extend($scope, {

        canModerate: currentUser.canModerate,

        deleteQuestion: function () {
          $location.path('/questions')
          /*questionsDataService.deleteQuestion($scope.questionId)
            .then(function () {
              $location.path('/questions')
            })*/
        },
        submitQuestionRevision: function () {
          if ($scope.sendingQuestionRevision) {
            return
          }

          var newQuestion = {
            title: $scope.editedTitle,
            body: $scope.editedBody,
            tags: window._.pluck($scope.editedTags, 'text'),
            people: window._.pluck($scope.editedPeople, 'email')
          }

          $scope.sendingQuestionRevision = true
          questionsDataService.reviseQuestion($scope.questionId, newQuestion)
            .then(loadQuestion)
            .then(function () {
              $scope.toggleEditor()
            })
            .finally(function () {
              $scope.sendingQuestionRevision = false
            })
        },
        submitAnswer: function () {
          if ($scope.answerQuestionForm.$invalid || $scope.sendingAnswer) {
            return
          }

          $scope.sendingAnswer = true
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(loadQuestion)
            .then(function () {
              $scope.answer = ''
              $scope.answerQuestionForm.$setPristine()
            })
            .finally(function () {
              $scope.sendingAnswer = false
            })
        },
        subscribeToQuestion: function () {
          questionsDataService.subscribeToQuestion($routeParams.id)
            .then(loadQuestion)
        },
        isSubscribed: function () {
          if ($scope.subscribers) {
            return window._.some($scope.subscribers, function (sub) {
              return sub.username === currentUser.username
            })
          }
          return false
        },
        isOwnQuestion: function () {
          if ($scope.author) {
            if (currentUser.username === $scope.author.username) {
              return true
            }
          }
          return false
        },
        submitQuestionComment: function (body) {
          return questionsDataService.addQuestionComment($routeParams.id, body)
            .then(function () {
              return questionsDataService.getQuestion($routeParams.id)
            })
            .then(loadQuestion)
        },
        submitQuestionCommentEdit: function (commentId, body) {
          return questionsDataService.reviseQuestionComment($routeParams.id, commentId, body)
          .then(function () {
            return questionsDataService.getQuestion($routeParams.id)
          })
          .then(loadQuestion)
        },
        submitQuestionCommentDelete: function (commentId) {
          return questionsDataService.deleteQuestionComment($routeParams.id, commentId)
          .then(function () {
            return questionsDataService.getQuestion($routeParams.id)
          })
          .then(loadQuestion)
        },
        toggleEditor: function() {
          $scope.editedTitle = $scope.title
          $scope.editedBody = $scope.body
          $scope.editedTags = window._.map($scope.tags)
          $scope.editedPeople = $scope.propsedPeople

          $scope.shouldShowEditor = !$scope.shouldShowEditor
        },
        loadQuestion: loadQuestion
      })

      $scope.votingInProgress = false

      $scope.user = currentUser

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion)
    }
  )
