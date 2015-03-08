angular.module('sugoiOverflow.controllers')
  .controller('newQuestionController',
    function($scope, $q, $location, $timeout, questionsDataService, tagsDataService, profilesDataService, suggestionsDataService) {
      'use strict';
      _.extend($scope, {
        user: {},
        title: '',
        body: '',
        tags: [],
        suggestedPeople: [],
        suggestedTags: [],
        getTagsAutocomlete: function(query){
          return _.filter($scope.availableTags, function(tag){
            return _.str.include(tag.text, query);
          });
        },
        addTag: function(tag){
          var newTag = {
            text: tag
          };
          $scope.tags.push(newTag);
          $scope.suggestedTags = _.without($scope.suggestedTags, tag);
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

      function getTagsSuggestions(){
          suggestionsDataService.getTags($scope.body, $scope.title)
            .then(function(tags){
              var existing = _.pluck($scope.tags, 'text');
              $scope.suggestedTags = _.filter(tags, function(t){return !_.includes(existing, t);});
            });
        }
      var timer;
      $scope.$watch('body', function(){
        if(timer){
          $timeout.cancel(timer);
        }
        timer = $timeout(getTagsSuggestions, 1500);
      });
    }
  );
