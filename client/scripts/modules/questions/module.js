angular.module('sugoiOverflow.questions', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
  .config(['$stateProvider',
    function($stateProvider){
      'use strict';

      $stateProvider
        .state('root.newQuestion', {
          url: '/newQuestion',
          templateUrl: '/views/questions/newQuestion.html',
        .state('root.questions.new', {
          url: 'questions/new',
          templateUrl: 'views/questions/newQuestion.html',
          controller: 'newQuestionController'
        });
    }
  ]);
