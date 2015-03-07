angular.module('sugoiOverflow.controllers')
  .controller('editProfileController',
    function($scope, $q, $routeParams, $location, tagsDataService, userDataService){
      'use strict';

      _.extend($scope, {
        submit: function(){
          var profile = {
            location: $scope.location,
            tags: $scope.selectedTags
          };

          userDataService.editProfile(profile)
            .then(function(){
              $location.path('/profile/me');
            });
        }
      });

      userDataService.getCurrentUser()
        .then(function(user){
/*          $scope.name = user.name;
          $scope.email = user.email;*/
          $scope.tags = user.selectedTags;
          $scope.location = user.location;
        });
    }
  );

