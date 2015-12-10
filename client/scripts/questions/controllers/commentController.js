/* global angular*/
/**
 * 
 */
angular.module('sugoiOverflow.questions')
  .controller('commentController',
    function ($scope, questionsDataService, currentUser) {
      'use strict'

      window._.extend($scope, {
        authorIsCurrentUser: function () {
          return $scope.answer.author.username == currentUser.username
        },
        /*submitAnswerRevision: function() {
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
        },*/
        toggleCommentEditor: function() {
          console.log("asdf")
          //$scope.commentRevision = $scope.comment.body
          $scope.shouldShowCommentEditor = !$scope.shouldShowCommentEditor
        }
      })
    }
  )
