/**
 * @ngdoc directive
 * @name soComments
 * @memberOf sugoiOverflow.questions
 * @scope
 * @description
 * Render comments and textarea to add post new comment
 * @param {array} so-comments Comments collection.
 * @param {function} so-comments-add Function to be called to add new comment.
 * Takes string as comment and should return promise.
 * @requires sugoiOverflow.questions.commentsController
 */
angular.module('sugoiOverflow.questions')
  .directive('soComments', function(){
    'use strict';

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/comments.html',
      scope: {
        comments: '=soComments',
        addComment: '=soCommentsAdd'
      },
      controller: 'commentsController'
    };
  });
