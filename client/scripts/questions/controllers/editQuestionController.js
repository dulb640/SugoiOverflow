/* global angular*/
angular.module('sugoiOverflow.questions')
  .controller('editQuestionController',
    function ($scope, $q, $location, $timeout, questionsDataService, tagsDataService, profilesDataService, suggestionsDataService, autocompleteService, changeCase) {
      'use strict'
      window._.extend($scope, {
        user: {},
        title: '',
        body: '',
        tags: [],
        people: [],
        suggestedPeople: [],
        suggestedTags: [],
        getTagsAutocomlete: function (query) {
          return autocompleteService(query, $scope.availableTags)
        },
        getPeopleAutocomplete: function (query) {
          return window._.filter($scope.availablePeople, function (person) {
            return window.s.include(person.email, query)
          })
        },
        addTag: function (tag) {
          var newTag = {
            text: tag
          }
          $scope.tags.push(newTag)
          $scope.suggestedTags = window._.without($scope.suggestedTags, tag)
        },
        addPerson: function (person) {
          $scope.people.push(person)
          $scope.suggestedPeople = window._.without($scope.suggestedPeople, person)
        },
        formatTag: function (tag) {
          tag.text = changeCase.paramCase(tag.text)
        }
      })

      profilesDataService.getCurrentUserProfile()
        .then(function (user) {
          $scope.user = user
        })

      tagsDataService.getAvailableTags()
        .then(function (tags) {
          $scope.availableTags = tags
        })
      profilesDataService.getAvailableProfiles()
        .then(function (people) {
          $scope.availablePeople = people
          console.log("got availablePeople")
          console.log(people)
        })

      function getTagsSuggestions () {
        suggestionsDataService.getTags($scope.body, $scope.title)
          .then(function (tags) {
            var existing = window._.pluck($scope.tags, 'text')
            $scope.suggestedTags = window._.filter(tags, function (t) { return !window._.includes(existing, t) })
          })
      }

      function getPeopleSuggestions () {
        suggestionsDataService.getPeople($scope.body, $scope.title)
          .then(function (people) {
            var existing = window._.pluck($scope.people, 'email')
            $scope.suggestedPeople = window._.filter(people, function (t) { return !window._.includes(existing, t) })
          })
      }
      var timer
      $scope.$watch('body', function () {
        if (timer) {
          $timeout.cancel(timer)
        }
        timer = $timeout(function () {
          getTagsSuggestions()
          getPeopleSuggestions()
        }, 1500)
      })
    }
  )
