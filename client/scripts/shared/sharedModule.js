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
      .factory('config', function ($http) {
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
      })
      .value('autocompleteService', function(query, availableTags){
        'use strict';
        return _.chain(availableTags)
          .map(function(tag){
            tag.score = _.str.levenshtein(query, tag.text.substring(0, query.length));
            return tag;
          })
          .filter(function(tag){
            return tag.score < 3;
          })
          .sortBy('score')
          .value();
      });
