angular.module('sugoiOverflow.questions')
  .factory('suggestionsDataService', function($http, $q) {
    'use strict';
    var service = {
      getTags: function(question, title) {
        var deferred = $q.defer();
        $http.post('/api/suggestions/tags', {
          question: question,
          title: title
        })
        .success(function(tags){
          deferred.resolve(tags);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      },
      getPeople: function(question, title) {
        var deferred = $q.defer();
        $http.post('/api/suggestions/people', {
          question: question,
          title: title
        })
        .success(function(people){
          deferred.resolve(people);
        })
        .error(function(error){
          deferred.reject(error);
        });
        return deferred.promise;
      }
  };
  return service;
});
