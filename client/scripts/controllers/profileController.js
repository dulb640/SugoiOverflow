'use strict';

angular.module('sugoiOverflow.controllers')
  .controller('profileController',
    function($scope, $q, tagsDataService, currentUserService){

      _.extend($scope, {
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){
          var ace = 1;
        }
      });

      var init = function(){
        $scope.user = currentUserService.user;
      };

      if (currentUserService.userId){
        init();
      } else {
      }
    }
  );

