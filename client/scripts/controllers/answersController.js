angular.module('sugoiOverflow.controllers')
  .controller('answersController',
    function($scope, $q, $routeParams, questionsDataService){
      'use strict';

      function loadQuestion(question){
        $scope.title = question.title;
        $scope.body = question.body;
        $scope.tags = question.tags;
        $scope.author = question.author;
        $scope.timestamp = question.timestamp;
        $scope.answers = question.answers;

        $scope.answer = '';
      }

      _.extend($scope, {
        submitAnswer: function(){
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(loadQuestion);
        }
      });

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
