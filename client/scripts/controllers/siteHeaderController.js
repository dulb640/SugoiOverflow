angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController', function ($scope, $location, $routeParams, profilesDataService, tagsDataService) {
    'use strict';

    _.extend($scope, {
      notifications: [],
      notificationsOpened: false,
      user: {},
      searchTerms: '',
      searchQuestions: function(){
        $location.path(_.str.sprintf('/questions/search/%s', $scope.searchTerms));
      },
      getTypeahead: function(){
        $scope.typeaheadLoading = true;
        return tagsDataService.getAvailableTags()
        .then(function(tags){
          return tags;
        })
        .finally(function(){
          $scope.typeaheadLoading = false;
        });
      },
      openNotifications: function(){
        $scope.notificationsOpened = true;
      },
      closeNotifications: function(){
        $scope.notificationsOpened = false;
      }
    });

    if($routeParams.searchTerms){
      $scope.searchTerms = $routeParams.searchTerms;
    }

    profilesDataService.getCurrentUserProfile()
    .then(function(user){
      $scope.user = user;
      $scope.notifications = user.notifications;
    });
  });
