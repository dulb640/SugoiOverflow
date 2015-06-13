angular.module('sugoiOverflow.profile')
  .controller('editProfileController',
    function($scope, $q, $routeParams, $location, $upload, $timeout, tagsDataService, profilesDataService, $localStorage, autocompleteService, changeCase){
      'use strict';

      function generateAvatarSrc(){
        $scope.avatarUrl = s.sprintf('/api/files/avatar/%s?%s', $scope.username, new Date().getTime());
      }

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
          if(!file){
            return;
          }
          $upload.upload({
            url: '/api/files/avatar',
            headers: {'Authorization': 'Bearer ' + $localStorage.jwt},
            file: file
          })
          .success(function () {
            generateAvatarSrc();
          });
        },
        getTagsAutocomlete: function(query){
          return autocompleteService(query, $scope.availableTags);
        },
        formatTag: function(tag) {
          tag.text = changeCase.paramCase(tag.text);
        }
      });

      profilesDataService.getCurrentUserProfile()
        .then(function(user){
          $scope.displayName = user.displayName;
          $scope.username = user.username;
          $scope.email = user.email;
          $scope.tags = _.map(user.profile.selectedTags, function mapTags (tag) {
            return {
              text: tag
            };
          });
          $scope.location = user.profile.location;
          $scope.karma = user.profile.karma;
          $scope.selectedTags = _.map(user.profile.selectedTags, function mapTags (tag) {
              return {
                text: tag
              };
            });
          $scope.location = user.profile.location;
          generateAvatarSrc();
        });

      tagsDataService.getAvailableTags()
        .then(function(tags){
          $scope.availableTags = tags;
        });
    }
  );
