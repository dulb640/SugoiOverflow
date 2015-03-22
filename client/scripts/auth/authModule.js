angular.module('sugoiOverflow.auth', [
  'angular-jwt',
  'ngStorage',
  'ngMessages',
  'ui.bootstrap',
  'sugoiOverflow.settings',
  'sugoiOverflow.shared',
  'sugoiOverflow.templates'])
  .config(function($routeProvider){
    'use strict';

    $routeProvider
      .when('/login', {
        templateUrl: 'scripts/auth/templates/login.html',
        controller: 'loginController'
      })
      .when('/register', {
        templateUrl: 'scripts/auth/templates/register.html',
        controller: 'registerController'
      });
  });
