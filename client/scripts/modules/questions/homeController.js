angular.module('sugoiOverflow.questions')
    .controller('homeController',
    function ($scope, $state, loadingService) {
        'use strict';

        $scope.showLoading = function() {
            loadingService.push();
        };
    });
