angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController', function ($scope, userDataService, questionsDataService) {
      'use strict';

      _.extend($scope, {
        notifications: 6,
        user: {},
        searchTerms: '',
        searchQuestions: function(terms){
          questionsDataService.searchQuestions(terms)
          .then(function(questionList){
            return questionList;
          });
        }
      });

      userDataService.getCurrentUser()
      .then(function(user){
        $scope.user = user;
      });
  });
