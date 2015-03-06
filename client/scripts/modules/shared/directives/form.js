angular.module('sugoiOverflow.shared')
	.directive('soForm', function() {
		'use strict';

        return {
            restrict: 'A',
            link: function (scope, element) {

            	element.find('input').on('keypress', function(e) {
					var keyCode = e.which || e.keyCode;
                	if (keyCode === 13) {
	                	e.target.blur();
                	}
				});
            }
        };
	});