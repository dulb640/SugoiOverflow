/**
 * @ngdoc controller
 * @name commentsController
 * @memberOf sugoiOverflow.questions
 * @description
 * This controller is being used by comments directive.
 * $scope will have comments injected and addComment function
 * which will be bound to submitting comments logic
 * expects to have addComment function on the scope
 */
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
