angular.module('sugoiOverflow.profile')
  .controller('editProfileController',
    function($scope, $q, $routeParams, $location, $upload, tagsDataService, profilesDataService, $localStorage){
      'use strict';

      _.extend($scope, {
        submit: function(){
          var profile = {
            location: $scope.location,
            selectedTags: _.pluck($scope.selectedTags, 'text')
          };

          profilesDataService.editProfile(profile)
            .then(function(){
              $location.path('/profile/me');
            });
        },
        uploadAvatar: function (files) {
          var file = files[0];
          $upload.upload({
              url: '/api/files/avatar',
              headers: {'Authorization': 'Bearer ' + $localStorage.jwt},
              file: file
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' +
                          evt.config.file.name);
          }).success(function (data, status, headers, config) {
              console.log('file ' + config.file.name + 'uploaded. Response: ' +
                          JSON.stringify(data));
          });
        }
      });

      profilesDataService.getCurrentUserProfile()
        .then(function(user){
/*          $scope.name = user.name;
          $scope.email = user.email;*/
          $scope.selectedTags = _.map(user.profile.selectedTags, function mapTags (tag) {
            return{
              text: tag
            };
          });
          $scope.location = user.profile.location;
        });
    }
  );

