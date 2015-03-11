angular.module('sugoiOverflow.controllers')
  .controller('registerController',
    function($scope, $q, $routeParams, $location, authService){
      'use strict';

      _.extend($scope, {
        submit: function(){
          var userDetails = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password,
          };

          authService.localRegister(userDetails)
            .then(function(){
              $scope.registered = true;
            });
        }
      });
    }
  );

