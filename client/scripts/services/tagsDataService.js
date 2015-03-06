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
        var TagMocks = function(){
          return [{name: 'POS', text : 'POS'},
                  {name: 'InternetTicketing', text: 'Internet Ticketing'},
                  {name: 'HeadOffice', text: 'Head Office'},
                  {name: 'BackOffice', text: 'Back Office'},
                  {name: 'CircuitManager', text: 'Circuit Manager'},
                  {name: 'Veezi', text: 'Veezi'}];
        };
        deferred.resolve(new TagMocks());
        return new TagMocks();
      }
    };
    return service;
  });


