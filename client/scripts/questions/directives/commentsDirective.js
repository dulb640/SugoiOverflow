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
      controller: function($scope){
        $scope.submit = function(){
          if($scope.addCommentForm.$invalid || $scope.sending){
            return;
          }

          $scope.sending = true;
          $scope.addComment($scope.body)
            .then(function(){
              $scope.body = '';
              $scope.addCommentForm.$submitted = false;
            })
            .finally(function(){
              $scope.sending = false;
            });
        };
      }
    };
  });
