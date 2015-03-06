angular.module('sugoiOverflow.shared')
.controller('Shared.ErrorOn403Controller',
	['$scope', '$state', '$modalInstance',
	function ($scope, $state, $modalInstance) {
	    'use strict';

	    $scope.goHome = function () {
	        $state.go('root.home');
	        $modalInstance.dismiss();
	    };
	}]);
