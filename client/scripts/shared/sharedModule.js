/* global angular*/
angular.module('sugoiOverflow.shared', [
    'angular-jwt',
    'ngStorage',
    'ngMessages',
    'ui.bootstrap',
    'angularFileUpload',
    'ngTagsInput',
    'pageslide-directive',
    'sugoiOverflow.settings',
    'sugoiOverflow.templates',
    'sugoiOverflow.auth'])
.run(function (configService, $rootScope, $document) {
  'use strict'
  function updateTitle (title) {
    $document[0].title = title
  }

  configService.then(function (conf) {
    var brandingTitle = conf.branding.title
    updateTitle(brandingTitle)
    $rootScope.$on('$routeChangeSuccess', function (event, next) {
      if (next.title) {
        var title = window.s.sprintf('%s - %s', brandingTitle, next.title)
        updateTitle(title)
      }
    })
  })
})
.factory('configService', function ($q, $http) {
  'use strict'

  return $q(function (resolve, reject) {
    $http.get('/api/config', { skipAuthorization: true })
      .success(function (config) {
        resolve(config)
      })
      .error(function (err) {
        reject(err)
      })
  })
})
.value('autocompleteService', function (query, availableTags) {
  'use strict'
  return window._.chain(availableTags)
    .map(function (tag) {
      tag.score = window.s.levenshtein(query, tag.text.substring(0, query.length))
      return tag
    })
    .filter(function (tag) {
      return tag.score < 3
    })
    .sortBy('score')
    .value()
})
