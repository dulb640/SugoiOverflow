angular.module('sugoiOverflow.questions')
  .controller('newQuestionController',
    function($scope, $q){
      'use strict'
      $scope.user = user
      _.extend($scope, {
        tags: [],
        loadTags: function($query){return [];},
        submit: function(){},
        getProfilePictureUrl: function(){}
      });
    }
  );
