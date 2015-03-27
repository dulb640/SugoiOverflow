angular.module('sugoiOverflow.profile')
  .controller('viewProfileController',
    function($scope, $q, $routeParams, tagsDataService, profilesDataService, questionsDataService){
      'use strict';

      _.extend($scope, {
        isOwnProfile: false,
        user: {},
        tags: [],
        questions: [],
      });

      function loadUser(user){
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
      }

      if (!$routeParams.username || $routeParams.username === 'me'){
        profilesDataService.getCurrentUserProfile()
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = true;
            questionsDataService.getQuestionsForUser(user.username)
              .then(function(questions){
                $scope.questions = questions;
                _.each($scope.questions, function(question){
                  question.tags = _.map(question.tags, function(tag){
                    return {
                      text: tag
                    };
                  });
                });
              });
          });
      }
      else {
        profilesDataService.getUser($routeParams.username)
          .then(function(user){
            loadUser(user);
            $scope.isOwnProfile = false;
            questionsDataService.getQuestionsForUser(user.username)
              .then(function(questions){
                $scope.questions = questions;
              });
          });
      }
    }
  );

