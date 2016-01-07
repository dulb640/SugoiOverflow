/**
 * When the value supplied to soFocus is true, give focus to the element
 */

angular.module('sugoiOverflow.questions')
  .directive('soFocus', function ($timeout) {
    'use strict'

    return {
      restrict: 'A',
      scope: {
        trigger: '=soFocus',
      },
      controller: 'focusController'
    }
  })