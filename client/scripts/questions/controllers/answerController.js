/* global angular*/
/**
 * This controller is being used by answer directive.
 * $scope will have answer injected and update function
 */
angular.module('sugoiOverflow.questions')
  .controller('answerController',
    function ($scope, questionsDataService, currentUser) {
      'use strict'

      window._.extend($scope, {
        submitComment: function (body) {
          return questionsDataService.addAnswerComment($scope.questionId, $scope.answer.id, body)
            .then($scope.update)
        },
        markAsCorrect: function () {
          if ($scope.isOwnQuestion()) {
            questionsDataService.markAnswerAsCorrect($scope.questionId, $scope.answer.id)
              .then($scope.update)
          }
        },
        hasUpVoted: function () {
          return window._.some($scope.answer.upVotes, function (upVoter) {
            return upVoter.username === currentUser.username
          })
        },
        hasDownVoted: function () {
          return window._.some($scope.answer.downVotes, function (downVoter) {
            return downVoter.username === currentUser.username
          })
        },
        upvote: function () {
          if ($scope.hasUpVoted()) {
            return
          }
          if (!$scope.votingInProgress) {
            $scope.votingInProgress = true
            questionsDataService.upvoteAnswer($scope.questionId, $scope.answer.id)
              .then(function () {
                questionsDataService.getQuestion($scope.questionId)
                .then($scope.update)
                $scope.votingInProgress = false
              })
          }
        },
        downvote: function () {
          if ($scope.hasDownVoted()) {
            return
          }
          if (!$scope.votingInProgress) {
            $scope.votingInProgress = true
            questionsDataService.downvoteAnswer($scope.questionId, $scope.answer.id)
              .then(function () {
                questionsDataService.getQuestion($scope.questionId)
                .then($scope.update)
                $scope.votingInProgress = false
              })
          }
        },
        authorIsCurrentUser: function () {
          return $scope.answer.author.username == currentUser.username
        },
        submitAnswerRevision: function() {
          if ($scope.answerRevisionForm.$invalid || $scope.sendingAnswerRevision) {
            return
          }

          $scope.sendingAnswerRevision = true
          questionsDataService.reviseAnswer($scope.questionId, $scope.answer.id, $scope.answerRevision)
            .then($scope.update)
            .then(function () {
              $scope.answerRevision = ''
              $scope.answerRevisionForm.$setPristine()
            })
            .finally(function () {
              $scope.sendingAnswerRevision = false
            })
        },
        toggleEditor: function() {
          $scope.answerRevision = $scope.answer.body
          $scope.shouldShowEditor = !$scope.shouldShowEditor
        }
      })
    }
  )
