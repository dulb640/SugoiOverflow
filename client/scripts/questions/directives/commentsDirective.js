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
