angular.module('sugoiOverflow.services')
  .factory('authService',
    function($http, $q) {
      'use strict';

      var service = {
        localLogin: function(credentials) {
            var deferred = $q.defer();
            $http.post('/api/auth/local', credentials, { skipAuthorization:true })
            .success(function(data){
              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        localRegister: function(userData) {
            var deferred = $q.defer();
            $http.post('/api/auth/local/register', userData, { skipAuthorization:true })
            .success(function(data){
              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        }
    };
    return service;
});
