/**
  * @class sugoiOverflow.questions
  * @memberOf sugoiOverflow
  */
angular.module('sugoiOverflow.questions', [
  'sugoiOverflow.shared',
  'angular-jwt',
  'ngRoute',
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
      .when('/questions/new/', {
        templateUrl: 'scripts/questions/templates/newQuestion.html',
        controller: 'newQuestionController',
        isSecured: true
      })
      .when('/questions/search/:searchTerms', {
        templateUrl: 'scripts/questions/templates/questions.html',
        controller: 'questionsController',
        isSecured: true
      })
      .when('/questions/:questionFilter?', {
        templateUrl: 'scripts/questions/templates/questions.html',
        controller: 'questionsController',
        isSecured: true
      })
      .when('/questions/:id/answers', {
        templateUrl: 'scripts/questions/templates/questionDetails.html',
        controller: 'questionDetailsController',
        isSecured: true
      });
  });

