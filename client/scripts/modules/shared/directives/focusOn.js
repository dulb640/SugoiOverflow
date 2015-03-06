angular.module('sugoiOverflow.shared').directive('soFocusOn', function() {
    'use strict';

    return function (scope, elem, attr) {
      scope.$on('focusOn', function(e, name) {
        if(name === attr.gsFocusOn) {
          elem[0].focus();
        }
      });
   };
});