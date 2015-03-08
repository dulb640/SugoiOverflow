angular.module('sugoiOverflow.filters').filter('markdown', function($sanitize) {
  'use strict';

  return function(input) {
    var markdown = marked(input);
    var sanitized = $sanitize(markdown);
    return sanitized;
  };
});
