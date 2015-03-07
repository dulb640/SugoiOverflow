angular.module('sugoiOverflow.controllers')
  .controller('editProfileController',
    function($scope, $q, $routeParams, $location, tagsDataService, profilesDataService){
      'use strict';

      _.extend($scope, {
        submit: function(){
          var profile = {
            location: $scope.location,
            tags: $scope.tags
          };

          profilesDataService.editProfile(profile)
            .then(function(){
              $location.path('/profile/me');
            });
        }
      });

      profilesDataService.getCurrentUserProfile()
        .then(function(user){
/*          $scope.name = user.name;
          $scope.email = user.email;*/
          $scope.tags = user.tags;
          $scope.location = user.location;
        });
    }
  );

