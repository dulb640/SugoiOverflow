angular.module('sugoiOverflow.auth')
  .controller('loginController',
    function($scope, $q, $routeParams, $location, authService, config){
      'use strict';

      config.then(function(conf){
        $scope.config = conf;
      });

      $scope.$watch('config.auth.activeDirectory', function(){
        if($scope.config.auth.activeDirectory){
          authService.adCheck()
            .then(function(data){
              $scope.adUser = data.user;
            });
        }
      });


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
