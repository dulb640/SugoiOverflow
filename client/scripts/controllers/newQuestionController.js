angular.module('sugoiOverflow.controllers')
  .controller('newQuestionController',
    function($scope, $q, $location, questionsDataService, tagsDataService, userDataService) {
      'use strict';
      _.extend($scope, {
          user: {},
          title: '',
          body: '',
          tags: [],
          suggestedPeople: [],
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

      userDataService.getCurrentUser()
          .then(function(user) {
              $scope.user = user;
          });

      /*userDataService.getSuggestedUsers()
          .then(function(suggestedPeople) {
              $scope.suggestedPeople = suggestedPeople;
          });

      tagsDataService.getAvailableTags()
          .then(function(tags){
              $scope.tags = tags;
          });*/
    }
  );
