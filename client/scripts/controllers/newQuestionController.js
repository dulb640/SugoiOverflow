angular.module('sugoiOverflow.controllers')
  .controller('newQuestionController',
    function($scope, $q, tagsDataService, userDataService){
      'use strict';
      _.extend($scope, {
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){},
        getProfilePictureUrl: function(){},
        loadPeople: function($query){return userDataService.getAvailableUsers($query);}
      });
      userDataService.getUser('1234')
      .then(function(user){
        $scope.user = user;
      });
    }
  );
