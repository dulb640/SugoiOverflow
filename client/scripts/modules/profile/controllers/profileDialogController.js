'use strict';

angular.module('sugoiOverflow.profile')
  .controller('profileController',
    function($scope, $q, tagsDataService, currentUserService){

      _.extend($scope, {
        user: {},
        tags: [],
        loadTags: function($query){return tagsDataService.getAvailableTags($query);},
        submit: function(){}
      });

      var init = function(){
        $scope.user = currentUserService.user;
      }

      if (currentUserService.userId){
        init();
      } else {
        eventAggregator.bindEvent($scope, eventAggregator.events.currentUserServiceInitialised, init);
      }
    }
  );
});
