/* global angular*/
/**
 * so-comments - Comments collection.
 *
 * so-comments-add - Function to be called to add new comment.
 * Takes string as comment and should return promise.
 * 
 * so-comments-edit: When the submit edit button on one of the comments is pressed, this function will be called.
 * Should take two arguments: question id and the new question body.
 * 
 * so-comments-delete: when the delete comment button is pressed, this function will be called.
 * Should take one argument: question id.
 *
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
        editComment: '=soCommentsEdit',
        deleteComment: '=soCommentsDelete'
      },
      controller: 'commentsController'
    }
  })
