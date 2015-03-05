angular.module('sugoiOverflow.profile')
  .controller('profileController', [
      '$scope',
      '$q',
    function($scope, $q){
      'use strict'

      _.extend($scope, {
        tags: [],
        loadTags: function($query){return [];},
        submit: function(){}
      });
    }
  ]);
