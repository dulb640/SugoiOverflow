angular.module('sugoiOverflow.questions')
  .controller('newQuestionController',
    function($scope, $q, $location, $timeout, questionsDataService, tagsDataService, profilesDataService, suggestionsDataService) {
      'use strict';
      _.extend($scope, {
        user: {},
        title: '',
        body: '',
        tags: [],
        people: [],
        suggestedPeople: [],
        suggestedTags: [],
        getTagsAutocomlete: function(query){
          return _.filter($scope.availableTags, function(tag){
            return _.str.include(tag.text, query);
          });
        },
        getPeopleAutocomplete: function(query){
          return _.filter($scope.availablePeople, function(person){
            return _.str.include(person.email, query);
          });
        },
        addTag: function(tag){
          var newTag = {
            text: tag
          };
          $scope.tags.push(newTag);
          $scope.suggestedTags = _.without($scope.suggestedTags, tag);
        },
        addPerson: function(person){
          $scope.people.push(person);
          $scope.suggestedPeople = _.without($scope.suggestedPeople, person);
        },
        submit: function() {
          var newQuestion = {
            title: $scope.title,
            body: $scope.body,
            tags: _.pluck($scope.tags, 'text'),
            people: $scope.people
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
      profilesDataService.getAvailableProfiles()
        .then(function(people){
            $scope.availablePeople = people;
        });

      function getTagsSuggestions(){
        suggestionsDataService.getTags($scope.body, $scope.title)
          .then(function(tags){
            var existing = _.pluck($scope.tags, 'text');
            $scope.suggestedTags = _.filter(tags, function(t){return !_.includes(existing, t);});
          });
      }

      function getPeopleSuggestions(){
        suggestionsDataService.getPeople($scope.body, $scope.title)
          .then(function(people){
            var existing = _.pluck($scope.people, 'email');
            $scope.suggestedPeople = _.filter(people, function(t){return !_.includes(existing, t);});
          });
      }
      var timer;
      $scope.$watch('body', function(){
        if(timer){
          $timeout.cancel(timer);
        }
        timer = $timeout(function(){
          getTagsSuggestions();
          getPeopleSuggestions();
        }, 1500);
      });
    }
  );
