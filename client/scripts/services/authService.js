angular.module('sugoiOverflow.services')
  .factory('authService',
    function($http, $q, $localStorage, $timeout) {
      'use strict';

      var service = {
        localLogin: function(credentials) {
            var deferred = $q.defer();
            $http.post('/api/auth/local', credentials, { skipAuthorization:true })
            .success(function(data){
              $localStorage.jwt = data.jwt;
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
        },
        logout: function() {
          return $timeout(function(){
            delete $localStorage.jwt;
          });
        }
    };
    return service;
});
