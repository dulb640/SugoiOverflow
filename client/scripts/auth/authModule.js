angular.module('sugoiOverflow.auth', [
  'angular-jwt',
  'ngStorage',
  'ngMessages',
  'ngRoute',
  'ui.bootstrap',
  'sugoiOverflow.settings',
  'sugoiOverflow.shared',
  'sugoiOverflow.templates'])
  .config(function($routeProvider){
    'use strict';

    $routeProvider
      .when('/login', {
        templateUrl: 'scripts/auth/templates/login.html',
        controller: 'loginController',
        title: 'Login'
      })
      .when('/register', {
        templateUrl: 'scripts/auth/templates/register.html',
        controller: 'registerController',
        title: 'Register'
      })
      .when('/logout', {
        template: '',
        controller: function($location, authService){
          authService.logout()
            .then(function(){
              $location.path('/login');
            });
        },
        isSecured: true
      });
  });
