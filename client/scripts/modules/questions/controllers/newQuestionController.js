angular.module('sugoiOverflow.questions')
  .controller('newQuestionController',
    function($scope, $q, tagsDataService, userDataService){
      'use strict'
      $scope.user = user
      _.extend($scope, {
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){},
        getProfilePictureUrl: function(){},
        loadPeople: function($query){return peopleDataService.getAvailablePeople($query);}
      });

      userDataService.getUser('1234')
      .then(function(user){
        $scope.user = user;
      })
      .catch(function(error){
      });
    }
  );
