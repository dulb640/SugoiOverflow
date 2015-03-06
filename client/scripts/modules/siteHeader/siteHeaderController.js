angular.module('sugoiOverflow.siteHeader')
  .controller('siteHeaderController', function ($scope, $state, loadingService) {
      'use strict';

      $scope.showLoading = function() {
          loadingService.push();
      };
  });
