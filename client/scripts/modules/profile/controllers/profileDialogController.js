'use strict';

angular.module('sugoiOverflow.profile')
  .controller('profileController',
    function($scope, $q){

      _.extend($scope, {
        tags: [],
        loadTags: function($query){return [];},
        submit: function(){}
      });
    });
