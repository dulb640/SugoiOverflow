angular.module('sugoiOverflow.auth')
  .controller('registerController',
    function($scope, $q, $routeParams, $location, authService){
      'use strict';

      authService.adCheck()
        .then(function(data){
          $scope.adUser = data.user;
        });

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
            })
            .then(function(){
              $location.path('/login');
            });
        },
        adLogin: function(){
          authService.adLogin()
            .then(function(){
              $location.path('/questions/suggested');
            });
        }
      });
    }
  );

