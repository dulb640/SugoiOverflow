/* global angular*/
angular.module('sugoiOverflow.shared').controller('rootController', function ($scope, $rootScope) {
  'use strict'
  $rootScope.$on('titleChanged', function (event, newTitle) {
    $scope.title = newTitle
  })
})
