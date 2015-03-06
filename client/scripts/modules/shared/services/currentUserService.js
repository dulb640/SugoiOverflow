angular.module('sugoiOverflow.shared')
  .factory('currentUserService',
  function($http, $q, eventAggregator){
    'use strict';

    return {
      userId: null,
      user: {},
      clearUser: function(){user = {}; userId=null;},
      loadUser: function(){
          $http.get('/api/currentUser/')
          .success(function(data){
            user = data;
            userId = data.userId;
            eventAggregator.raiseEvent(eventAggregator.events.currentUserServiceInitialised, user)
          })
          .error(function(error){
            clearUser();
          });
          return deferred.promise;
        }
    };
  });
