angular.module('sugoiOverflow.profile', [
  'sugoiOverflow.shared',
  'angular-jwt',
  'ngStorage',
  'ngMessages',
  'ui.bootstrap',
  'angularFileUpload',
  'wiz.markdown',
  'ngTagsInput',
  'pageslide-directive',
  'sugoiOverflow.settings',
  'sugoiOverflow.shared',
  'sugoiOverflow.templates',
  'sugoiOverflow.auth'])
  .config(function($routeProvider){
    'use strict';

    $routeProvider
      .when('/profile', {
        redirectTo: '/profile/me'
      })
      .when('/profile/me', {
        templateUrl: 'scripts/profile/templates/viewProfile.html',
        controller: 'viewProfileController'
      })
      .when('/profile/me/edit', {
        templateUrl: 'scripts/profile/templates/editProfile.html',
        controller: 'editProfileController'
      })
      .when('/profile/:username', {
        templateUrl: 'scripts/profile/templates/viewProfile.html',
        controller: 'viewProfileController'
      });
  });
