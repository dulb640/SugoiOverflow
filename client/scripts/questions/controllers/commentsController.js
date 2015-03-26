angular.module('sugoiOverflow.questions')
  .controller('commentsController',
    function($scope){
      'use strict';
      $scope.submit = function(){
        if($scope.addCommentForm.$invalid || $scope.sending){
          return;
        }

        $scope.sending = true;
        $scope.addComment($scope.body)
          .then(function(){
            $scope.body = '';
            $scope.addCommentForm.$setPristine();
          })
          .finally(function(){
            $scope.sending = false;
          });
      };
    }
  );
