/* global angular*/
angular.module('sugoiOverflow.questions')
  .controller('commentController',
    function ($scope, questionsDataService, currentUser) {
      'use strict'

      window._.extend($scope, {
        isOwnComment: function () {
          return $scope.comment.author.username == currentUser.username
        },
        submitCommentRevision: function() {
          if ($scope.editCommentForm.$invalid || $scope.sendingCommentRevision) {
            return
          }

          $scope.sendingCommentRevision = true
          $scope.submitEdit($scope.comment.id, $scope.commentRevision)
            .then(function () {
              $scope.commentRevision = ''
              $scope.editCommentForm.$setPristine()
            })
            .finally(function () {
              $scope.sendingCommentRevision = false
            })
        },
        toggleCommentEditor: function() {
          $scope.commentRevision = $scope.comment.body
          $scope.shouldShowCommentEditor = !$scope.shouldShowCommentEditor
        }
      })
    }
  )
