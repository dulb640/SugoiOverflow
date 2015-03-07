angular.module('sugoiOverflow.controllers')
  .controller('viewProfileController',
    function($scope, $q, $routeParams, tagsDataService, userDataService){
      'use strict';

      _.extend($scope, {
        isOwnProfile: false,
        profilePictureUrl: '',
        user: {},
        tags: []
      });

      function loadUser(user){
        $scope.name = user.name;
        $scope.email = user.email;
        $scope.tags = user.selectedTags;
        $scope.location = user.location;
        $scope.profilePictureUrl = user.profilePictureUrl || '/content/no-avatar.jpg';
      }

      if (!$routeParams.userId || $routeParams.userId === 'me'){
        userDataService.getCurrentUser()
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = true;
          });
      }
      else {
        userDataService.getUser($routeParams.userId)
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = false;
          });
      }
    }
  );

