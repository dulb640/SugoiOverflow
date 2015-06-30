/* global angular*/
angular.module('sugoiOverflow.auth')
  .controller('registerController',
    function ($scope, $q, $routeParams, $location, authService, configService) {
      'use strict'

      configService.then(function (config) {
        $scope.config = config
      })

      $scope.$watch('config.auth.activeDirectory', function () {
        if ($scope.config.auth.activeDirectory) {
          authService.adCheck()
            .then(function (data) {
              $scope.adUser = data.user
            })
        }
      })

      window._.extend($scope, {
        submit: function () {
          var userDetails = {
            username: $scope.username,
            email: $scope.email,
            password: $scope.password
          }

          authService.localRegister(userDetails)
            .then(function () {
              $scope.registered = true
            })
            .then(function () {
              $location.path('/login')
            })
        },
        adLogin: function () {
          authService.adLogin()
            .then(function () {
              $location.path('/questions/suggested')
            })
        }
      })
    }
  )
