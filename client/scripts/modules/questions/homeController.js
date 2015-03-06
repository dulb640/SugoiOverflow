angular.module('sugoiOverflow.questions')
    .controller('homeController', ['$scope', '$state', 'loadingService',
    function ($scope, $state, loadingService) {
        'use strict';

        $scope.showLoading = function() {
            loadingService.push();
        };
    }]);