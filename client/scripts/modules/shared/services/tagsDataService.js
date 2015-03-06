angular.module('sugoiOverflow')
  .factory('tagsDataService',
  'use strict';
  function($http, $q){
    var service = {
      getAvailableTags: function(query){
        var deferred = $q.defer();
        $http.get('/api/tags/' + query)
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
    function($http, $q){
      var service = {
        getAvailableTags: function(query){
          var deferred = $q.defer();
          $http.get('/api/tags/' + query)
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
