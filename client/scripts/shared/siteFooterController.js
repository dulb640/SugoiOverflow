/* global angular*/
angular.module('sugoiOverflow.shared')
  .controller('siteFooterController',
    function ($rootScope,
      $scope,
      configService) {
      'use strict'

      configService.then(function (conf) {
        $scope.config = conf
      })
    })
