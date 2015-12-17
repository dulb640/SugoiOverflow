/* global angular*/
/**
 * This controller is being used by comments directive.
 * $scope will have comments injected and addComment function
 * which will be bound to submitting comments logic
 * expects to have addComment function on the scope
 */
angular.module('sugoiOverflow.questions')
  .controller('commentsController',
    function ($scope, $element, $timeout) {
      'use strict'
      $scope.submit = function () {
        if ($scope.addCommentForm.$invalid || $scope.sending) {
          return
        }

        $scope.sending = true
        $scope.addComment($scope.body)
          .then(function () {
            $scope.body = ''
            $scope.addCommentForm.$setPristine()
          })
          .finally(function () {
            $scope.sending = false
            $scope.shouldShowAddBox = false
          })
      }
      window._.extend($scope, {
        toggleAddBox: function () {
          $scope.shouldShowAddBox = !$scope.shouldShowAddBox
        }
      })

      // The $watch is fired when the text area should show, but
      // before it is actually showing. Focusing only works if the
      // box is visible. Setting a 0 millisecond timer allows the
      // box to be actually shown before focusing on it.

      var textBox = $element.find('.addCommentBox')
      var timer
      $scope.$watch('shouldShowAddBox', function (value) {
        if (value === true) {
          timer = $timeout(function () {
            textBox[0].focus()
          }, 0)
        }
      })


    }
  )
