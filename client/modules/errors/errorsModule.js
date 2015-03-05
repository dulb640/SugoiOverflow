angular.module('sugoiOverflow.errors', ['sugoiOverflow.settings', 'sugoiOverflow.shared', 'ui.router'])
    .config([
        '$stateProvider', function($stateProvider) {
            'use strict';

    $stateProvider
        .state('root.errors-500', {
            url: '/errors/server-error',
            onEnter: ['loadingService', function (loadingService) {
                loadingService.clear();
            }],
            controller: 'errorPageController',
            templateUrl: 'Scripts/app/views/errors/errorPage500.html'
        })
        .state('root.errors-404', {
            url: '/errors/page-not-found-error',
            onEnter: ['loadingService', function (loadingService) {
                loadingService.clear();
            }],
            controller: 'errorPageController',
            templateUrl: 'Scripts/app/views/errors/errorPage404.html'
        })
        .state('root.errors-403', {
            url: '/errors/unauthorised-error',
            onEnter: ['loadingService', function (loadingService) {
                loadingService.clear();
            }],
            templateUrl: 'Scripts/app/views/errors/errorPage403.html'
        });
}]);
