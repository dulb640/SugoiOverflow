angular.module('sugoiOverflow.services')
  .factory('userDataService',
    function($http, $q){
      'use strict';
      var service = {
        getUser: function(userId){
          var deferred = $q.defer();
          // $http.get('/api/user/' + userId)
          // .success(function(data){
          //   deferred.resolve(data);
          // })
          // .error(function(error){
          //   deferred.reject(error);
          // });
          deferred.resolve(new UserMock());
          return deferred.promise;
        },

        getCurrentUser: function(){
          var deferred = $q.defer();
          // $http.get('/api/user/' + userId)
          // .success(function(data){
          //   deferred.resolve(data);
          // })
          // .error(function(error){
          //   deferred.reject(error);
          // });
          deferred.resolve({
            userId: '1234',
            name: 'jack',
            karma: 99,
            location: 'Water Cooler',
            tags: [{text: 'hello'}]
          });
          return deferred.promise;
        },

        saveUserDetails: function(userId, user){

        }
      };

      return service;
    }
  );

var UserMock =  function(){
  'use strict';
  return {
      userId: '2836',
      name: 'Jacky Zhen',
      karma: 897,
      location: 'Level 3',
      tags: [{name: 'Veezi', text: 'Veezi'}]
    };
};
