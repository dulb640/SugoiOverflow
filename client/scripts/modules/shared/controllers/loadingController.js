angular.module('sugoiOverflow.shared')
    .controller('loadingController', ['$scope', 'loadingService',
    function ($scope, loadingService) {
        'use strict';

        $scope.loadingService = loadingService;
    }]);