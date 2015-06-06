angular.module('sugoiOverflow.shared', [
    'angular-jwt',
    'ngStorage',
    'ngMessages',
    'ui.bootstrap',
    'angularFileUpload',
    'wiz.markdown',
    'ngTagsInput',
    'pageslide-directive',
    'sugoiOverflow.settings',
    'sugoiOverflow.templates',
    'sugoiOverflow.auth'])
    .service('config', function ($http) {
  'use strict';
    var defaultConfig = {
      branding: {
        title:''
      },
      auth: {
        local: false,
        activeDirectory: false
      }
    };

    return function($scope){
      $scope.config = defaultConfig;
      $http.get('/api/config', { skipAuthorization: true })
        .success(function(configResponse){
          $scope.config = _.extend($scope.config, configResponse);
        });
    };
  });
