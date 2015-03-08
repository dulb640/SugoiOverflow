angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController', function ($scope, profilesDataService, questionsDataService) {
    'use strict';

    _.extend($scope, {
      notifications: [],
      notificationsOpened: false,
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
      },
      openNotifications: function(){
        $scope.notificationsOpened = true;
      },
      closeNotifications: function(){
        $scope.notificationsOpened = false;
      }
    });

    profilesDataService.getCurrentUserProfile()
    .then(function(user){
      $scope.user = user;
      $scope.notifications = user.notifications;
    });
  });
