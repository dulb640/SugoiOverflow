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
      .factory('config', function ($q, $http) {
        'use strict';

        return $q(function(resolve, reject) {
          $http.get('/api/config', { skipAuthorization: true })
            .success(function(config){
              resolve(config);
            })
            .error(function(err){
              reject(err);
            });
        });
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
