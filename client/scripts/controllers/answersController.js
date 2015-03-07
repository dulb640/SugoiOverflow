angular.module('sugoiOverflow.controllers')
  .controller('answersController',
    function($scope, $q, $routeParams, questionsDataService){
      'use strict';

      _.extend($scope, {
        question: {}, //Will have header information about questions - will change based on user tab selection
        voteQuestion: function(isUpvote){

        }
      });

      var init = function(){
        questionsDataService.getQuestion($routeParams.id)
          .then(function(question){
            $scope.question = question;
          });
      };

      init();
    }
  );
