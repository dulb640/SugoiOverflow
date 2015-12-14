/* global angular*/
/**
 * There should be one commentDirective per comment.
 * This is only intended for use by commentsDirective.
 * 
 * so-submit-edit: when the submit edit button is pressed, this function will be called.
 * Should take two arguments: question id and the new question body.
 * 
 * so-comment-delete: when the delete comment button is pressed, this function will be called.
 * Should take one argument: question id.
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
        deleteComment: '=soCommentDelete'
      },
      controller: 'commentController'
    }
  })