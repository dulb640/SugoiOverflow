angular.module('sugoiOverflow.questions', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
  .config(['$stateProvider',
    function($stateProvider){
      'use strict';

      $stateProvider
        .state('root.newQuestion', {
          url: '/newQuestion',
          templateUrl: 'client/views/questions/newQuestion.html',
          controller: 'newQuestionController'
        });
    }
  ]);
