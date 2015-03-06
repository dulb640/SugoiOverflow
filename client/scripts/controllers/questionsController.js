angular.module('sugoiOverflow.controllers')
  .controller('questionsController',
    function($scope, $q, $routeParams, questionsDataService){
      'use strict';

      var questionFilter = $routeParams.questionFilter;

      _.extend($scope, {
        questions: {}, //Will have header information about questions - will change based on user tab selection
      });

      var init = function(){
        if (!questionFilter){
          questionFilter = 'suggested';
        }
        questionsDataService.getQuestionsList(questionFilter)
          .then(function(questions){
            $scope.questions = questions;
          });
      };

      init();
    }
  );
