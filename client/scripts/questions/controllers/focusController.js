// The $watch is fired when the text area should show, but
// before it is actually showing. Focusing only works if the
// box is visible. Setting a 0 millisecond timer allows the
// box to be actually shown before focusing on it.

angular.module('sugoiOverflow.questions')
  .controller('focusController',
    function ($scope, $element, $timeout) {
      'use strict'
      var timer
      $scope.$watch('trigger', function (value) {
        if (value === true) {
          timer = $timeout(function () {
            $element[0].focus()
          }, 0)
        }
      })
    }
  )