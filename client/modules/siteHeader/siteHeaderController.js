angular.module('sugoiOverflow.siteHeader')
    .controller('siteHeaderController', ['$scope', '$state', 'loadingService',
    function ($scope, $state, loadingService) {
        'use strict';

        $scope.showLoading = function() {
            loadingService.push();
        };
    }]);