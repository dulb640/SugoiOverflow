angular.module('sugoiOverflow.shared').directive('soFocus', ['$timeout',
	function ($timeout) {
		'use strict';
	    return {
	        scope: {
	            soFocus: '=soFocus'
	        },
	        link: function (scope, element) {
	            scope.$watch('soFocus', function (value) {
	                if (value) {
	                    $timeout(function () {
	                        element[0].focus();
	                    });
	                }
	            });
	        }
	    };
	}]
);