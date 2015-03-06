angular.module('sugoiOverflow.profile')
  .controller('profileController',
    function($scope, $q, tagsDataService, userDataService){
      'use strict'

      _.extend($scope, {
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){}
      });

      userDataService.getUser('1234')
      .then(function(user){
        $scope.user = user;
      })
      .catch(function(error){
      });
    }
  );
