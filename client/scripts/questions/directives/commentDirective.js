/* global angular*/
/**
 * There should be one commentDirective per comment.
 * This is only intended for use by commentsDirective.
 * 
 * so-submit-edit: when the comment is edited, it will call this function.
 *
 * requires sugoiOverflow.questions.commentController
 */
angular.module('sugoiOverflow.questions')
  .directive('soComment', function () {
    'use strict'

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/comment.html',
      scope: {
        comment: '=soComment',
        submitEdit: '=soSubmitEdit',
      },
      controller: 'commentController'
    }
  })