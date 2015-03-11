angular.module('sugoiOverflow.controllers')
  .controller('viewProfileController',
    function($scope, $q, $routeParams, tagsDataService, profilesDataService, questionsDataService){
      'use strict';

      _.extend($scope, {
        isOwnProfile: false,
        profilePictureUrl: '',
        user: {},
        tags: [],
        questions: [],
      });

      function loadUser(user){
        $scope.name = user.name;
        $scope.email = user.email;
        $scope.tags = user.tags;
        $scope.location = user.location;
        $scope.karma = user.karma;
        $scope.profilePictureUrl = user.profilePictureUrl || '/content/no-avatar.jpg';
      }

      if (!$routeParams.username || $routeParams.username === 'me'){
        profilesDataService.getCurrentUserProfile()
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = true;
            questionsDataService.getQuestionsForUser(user.id)
              .then(function(questions){
                $scope.questions = questions;
              });
          });
      }
      else {
        profilesDataService.getUser($routeParams.username)
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = false;
            questionsDataService.getQuestionsForUser(user.id)
              .then(function(questions){
                $scope.questions = questions;
              });
          });
      }
    }
  );

