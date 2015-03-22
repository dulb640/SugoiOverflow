angular.module('sugoiOverflow.questions')
  .factory('tagsDataService', function($http, $q) {
    'use strict';
    var service = {
      getAvailableTags: function() {
        var deferred = $q.defer();
        $http.get('/api/tags/top')
        .success(function(tags){
          deferred.resolve(tags);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      }
  };
  return service;
});
