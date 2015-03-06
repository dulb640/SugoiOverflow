angular.module('sugoiOverflow.shared')
  .factory('currentUserService',
  function($http, $q, eventAggregator){
    'use strict';

    return {
      loadUser: function(){
          $http.get('/api/currentUser/')
          .success(function(data){
            eventAggregator.raiseEvent(eventAggregator.events.currentUserServiceInitialised, data);
          });
        }
    };
  });
