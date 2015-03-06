angular.module('sugoiOverflow.services')
  .factory('tagsDataService',
  function($http, $q){
    'use strict';
    var service = {
      getAvailableTags: function($query){
         var deferred = $q.defer();
        // $http.get('/api/tags/' + query)
        // .success(function(data){
        //   deferred.resolve(data);
        // })
        // .error(function(error){
        //   deferred.reject(error);
        // });

        deferred.resolve(new TagMocks());
        return new TagMocks();
      }
    };
    return service;
  });

var TagMocks = function(){
  'use strict';
  return new [{name: 'POS', text : 'POS'},
          {name: 'InternetTicketing', text: 'Internet Ticketing'},
          {name: 'HeadOffice', text: 'Head Office'},
          {name: 'BackOffice', text: 'Back Office'},
          {name: 'CircuitManager, text: Circuit Manager'},
          {name: 'Veezi', text: 'Veezi'}]();
};
