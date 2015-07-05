/* global angular, _ */
angular.module('sugoiOverflow.questions')
  .controller('addLinkController',
    function ($scope, $modalInstance) {
      'use strict'

      _.extend($scope, {
        cancel: function () {
          $modalInstance.dismiss()
        },
        ok: function () {
          var item = {
            url: $scope.url,
            text: $scope.text
          }

          $modalInstance.close(item)
        }
      })
    })
