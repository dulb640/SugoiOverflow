angular.module('sugoiOverflow.services')
  .factory('currentUserService',
  function($http, $q){
    'use strict';

    return {
      loadUser: function(){
          $http.get('/api/currentUser/')
          .success(function(data){

          });
        }
    };
  });
