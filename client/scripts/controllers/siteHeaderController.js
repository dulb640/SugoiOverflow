angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController', function ($scope, profilesDataService, questionsDataService) {
      'use strict';

      _.extend($scope, {
        notifications: 6,
        user: {},
        searchTerms: '',
        searchQuestions: function(terms){
          return questionsDataService.searchQuestions(terms)
          .then(function(questionList){
            return questionList;
          })
          .catch(function(error){
            return [];
          });
        }
      });

      profilesDataService.getCurrentUserProfile()
      .then(function(user){
        $scope.user = user;
      });
  });
