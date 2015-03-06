angular.module('sugoiOverflow.shared')
  .factory('userDataService',

    function($http, $q){
      var service = {
        getUser: function(userId){
          var deferred = $q.defer();
          $http.get('/api/user/' + userId)
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
    }
  );
