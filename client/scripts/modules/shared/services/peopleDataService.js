angular.module('sugoiOverflow')
  .factory('peopleDataService',
  'use strict';
  function($http, $q){
    var service = {
      getAvailablePeople: function(query){
        var deferred = $q.defer();
        $http.get('/api/people/' + query)
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
  });
