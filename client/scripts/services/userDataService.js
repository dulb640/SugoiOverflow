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
          deferred.resolve({
            userId: userId,
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
