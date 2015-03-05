angular.module('sugoiOverflow.errors')
    .controller('errorPageController', ['$scope', 'loadingService',
    function ($scope, loadingService) {
        'use strict';
        loadingService.clear();
    }]);