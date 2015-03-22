angular.module('sugoiOverflow.auth')
  .factory('authService',
    function($http, $q, $localStorage, $timeout, currentUser) {
      'use strict';

      function handleAuth(data){
        $localStorage.jwt = data.jwt;
        currentUser.email = data.email;
        currentUser.username = data.username;
        currentUser.displayName = data.displayName;
        return data;
      }

      var service = {
        adCheck: function adCheck(){
          var deferred = $q.defer();
            $http.get('/api/auth/active-directory', { skipAuthorization: true })
            .success(function(data){
              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        adLogin: function adLogin(){
          var deferred = $q.defer();
            $http.post('/api/auth/active-directory', null, { skipAuthorization: true })
            .success(function(data){
              handleAuth(data);
              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        localLogin: function localLogin(credentials) {
            var deferred = $q.defer();
            $http.post('/api/auth/local', credentials, { skipAuthorization: true })
            .success(function(data){
              handleAuth(data);

              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        localRegister: function localRegister(userData) {
            var deferred = $q.defer();
            $http.post('/api/auth/local/register', userData, { skipAuthorization: true })
            .success(function(data){
              deferred.resolve(data);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },
        logout: function logout() {
          return $timeout(function(){
            delete $localStorage.jwt;
            currentUser.clear();
          });
        }
    };
    return service;
});
