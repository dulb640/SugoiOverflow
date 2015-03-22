angular.module('sugoiOverflow.questions')
  .controller('questionsController',
    function($scope, $q, $routeParams, $route, questionsDataService){
      'use strict';

      var questionFilter = $routeParams.questionFilter;
      var searchTerms = $routeParams.searchTerms;

      _.extend($scope, {
        questionFilter: questionFilter,
        searchTerms: searchTerms,
        questions: {}, //Will have header information about questions - will change based on user tab selection,
        suggestedNotEmpty : true,
        suggestedIsEmpty: function() {
          $scope.suggestedNotEmpty = !(questionFilter === 'suggested' && !$scope.questions.length);
        }
      });

      var init = function(){
        var promise;
        if (searchTerms){
          promise = questionsDataService.getQuestionsListSearch(searchTerms);
        }
        else{
          switch(questionFilter){
            case 'all':
              promise = questionsDataService.getAllQuestionsList();
              break;
            case 'suggested':
              promise = questionsDataService.getSuggestedQuestionsList();
              break;
            case 'most-wanted':
              promise = questionsDataService.getMostWantedQuestionsList();
              break;
          }
        }
        promise
          .then(function(questions){
            $scope.questions = questions;
            _.each($scope.questions, function(question){
              question.tags = _.map(question.tags, function(tag){
                return {
                  text: tag
                };
              });
            });
            $scope.suggestedIsEmpty();
          });
      };

      init();
    }
  );
