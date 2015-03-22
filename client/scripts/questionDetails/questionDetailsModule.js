angular.module('sugoiOverflow.questionDetails', [
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
.config(function($httpProvider, $routeProvider){
    'use strict';

    $routeProvider
      .when('/questions/:id/answers', {
        templateUrl: 'scripts/questionDetails/templates/questionDetails.html',
        controller: 'questionDetailsController'
      });
  });

