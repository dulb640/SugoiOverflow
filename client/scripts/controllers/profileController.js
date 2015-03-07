angular.module('sugoiOverflow.controllers')
  .controller('profileController',
    function($scope, $q, $routeParams, tagsDataService, userDataService){
      'use strict';

      _.extend($scope, {
        isOwnProfile: false,
        showSuccessfulSubmit: false,
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){
          //Only submit the form when viewing own profile
          $scope.showSuccessfulSubmit = false;
          if ($scope.isOwnProfile){
            userDataService.saveUserDetails($scope.user.userId, $scope.user)
            .then(function(){
              $scope.showSuccessfulSubmit = true;
            });
          }
        }
      });

      if ($routeParams.userId){
        userDataService.getUser($routeParams.userId)
        .then(function(user){
          $scope.user = user;
        });
      } else {
        userDataService.getCurrentUser()
        .then(function(user){
          $scope.user = user;
          $scope.isOwnProfile = true;
        });
      }

    }
  );

