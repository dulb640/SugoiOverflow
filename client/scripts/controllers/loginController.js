angular.module('sugoiOverflow.controllers')
  .controller('loginController',
    function($scope, $q, $routeParams, $location, authService){
      'use strict';

      _.extend($scope, {
        submit: function(){
          var credentials = {
            username: $scope.usernameOrEmail,
            password: $scope.password
          };

          authService.localLogin(credentials)
            .then(function(){
              $location.path('/questions/suggested');
            });
        }
      });
    }
  );

