angular.module('sugoiOverflow.services')
  .factory('profilesDataService',
    function($http, $q, mappingService) {
      'use strict';

      var service = {
        getUser: function(username) {
            var deferred = $q.defer();
            $http.get(_.str.sprintf('/api/profiles/%s', username))
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },

        getCurrentUserProfile: function() {
          var deferred = $q.defer();
          $http.get('/api/profiles/me')
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        getCurrentUserNotifications: function() {
          var deferred = $q.defer();
          $http.get('/api/profiles/me/feed')
            .success(function(data){
              deferred.resolve(data.questionNotifications);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        markNotificationAsRead: function(username) {
          var deferred = $q.defer();
          $http.put(_.str.sprintf('/api/profiles/me/feed/%s/read', username))
            .success(function(data){
              deferred.resolve(data.questionNotifications);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        editProfile: function(data) {
          var profile = mappingService.mapProfileForApi(data);
          var deferred = $q.defer();
          $http.put('/api/profiles/me', profile)
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        getAvailableProfiles: function() {
          var deferred = $q.defer();
          $http.get('/api/profiles')
          .success(function(people){
            var profiles = _.map(people, mappingService.mapProfileForClient);
            deferred.resolve(profiles);
          })
          .error(function(error){
            deferred.reject(error);
          });
          return deferred.promise;
        }
    };


    return service;


});
