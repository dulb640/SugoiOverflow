/* global angular*/
/**
 * so-comments - Comments collection.
 * so-comments-add - Function to be called to add new comment.
 * Takes string as comment and should return promise.
 * requires sugoiOverflow.questions.commentsController
 */
angular.module('sugoiOverflow.questions')
  .directive('soComments', function () {
    'use strict'

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/comments.html',
      scope: {
        comments: '=soComments',
        addComment: '=soCommentsAdd',
        editComment: '=soCommentsEdit'
      },
      controller: 'commentsController'
    }
  })
