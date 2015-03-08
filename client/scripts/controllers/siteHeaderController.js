angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController', function ($scope, profilesDataService, questionsDataService) {
    'use strict';

    _.extend($scope, {
      notifications: 6,
      user: {},
      searchTerms: '',
/*      searchQuestions: function(terms){
        $location.path(_.str.sprintf('/#/questions/search/%s', terms));
      }*/
      searchQuestions: function(terms){
        $scope.searchLoading = true;
        return questionsDataService.searchQuestions(terms)
        .then(function(questionList){
          return questionList;
        })
        .finally(function(){
          $scope.searchLoading = false;
        });
      }
    });

    profilesDataService.getCurrentUserProfile()
    .then(function(user){
      $scope.user = user;
    });
  });
