angular.module('sugoiOverflow.services')
  .factory('tagsDataService',
  function($http, $q){
    'use strict';
    var service = {
      getAvailableTags: function(){
        var deferred = $q.defer();
        // $http.get('/api/tags/' + query)
        // .success(function(data){
        //   deferred.resolve(data);
        // })
        // .error(function(error){
        //   deferred.reject(error);
        // });

        deferred.resolve([{text: 'Tag 1'}, {text: 'Tag 2'}]);
        return deferred.promise;
      }
    };
    return service;
  });
