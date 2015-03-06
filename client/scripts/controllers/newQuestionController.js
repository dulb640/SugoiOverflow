angular.module('sugoiOverflow.controllers')
    .controller('newQuestionController',
        function($scope, $q, tagsDataService, userDataService) {
            'use strict';
            _.extend($scope, {
                user: {},
                tags: [],
                suggestedPeople: [],
                loadTags: function($query) {
                    return tagsDataService.getAvailableTags($query);
                },
                submit: function() {},
                loadPeople: function($query) {
                    return userDataService.getSuggestedUsers($query);
                }
            });
            userDataService.getUser('1234')
                .then(function(user) {
                    $scope.user = user;
                });
            userDataService.getSuggestedUsers()
                .then(function(suggestedPeople) {
                    $scope.suggestedPeople = suggestedPeople;
                });
            tagsDataService.getAvailableTags()
                .then(function(tags){
                    $scope.tags = tags;
                });
        }
    );
