angular.module('sugoiOverflow.controllers')
  .controller('newQuestionController',
    function($scope, $q, $location, questionsDataService, tagsDataService, profilesDataService) {
      'use strict';
      _.extend($scope, {
          user: {},
          title: '',
          body: '',
          tags: [],
          suggestedPeople: [],
          getTagsSuggestions: function(query){
            return _.filter($scope.availableTags, function(tag){
              return _.str.include(tag.text, query);
            });
          },
          submit: function() {
            var newQuestion = {
              title: $scope.title,
              body: $scope.body,
              tags: $scope.tags
            };
            questionsDataService.addQuestion(newQuestion)
              .then(function(addedQuestion){
                $location.path(_.str.sprintf('/questions/%s/answers', addedQuestion.id));
              });
          },
      });

      profilesDataService.getCurrentUserProfile()
          .then(function(user) {
              $scope.user = user;
          });

      /*profilesDataService.getSuggestedUsers()
          .then(function(suggestedPeople) {
              $scope.suggestedPeople = suggestedPeople;
          });*/

      tagsDataService.getAvailableTags()
          .then(function(tags){
              $scope.availableTags = tags;
          });
    }
  );
