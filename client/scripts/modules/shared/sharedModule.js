(function () {
    'use strict';

    angular.module('sugoiOverflow.shared', ['sugoiOverflow.settings', 'ui.router', 'ui.bootstrap'])
		.config(['$provide', function ($provide) {

		    // make sure modals close when state changes.
		    $provide.decorator('$modalStack', ['$rootScope', '$delegate', function ($rootScope, $delegate) {

		        var open = $delegate.open.bind($delegate);

		        $delegate.open = function (modalInstance, modal) {

		            var clearStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function () {
		                modalInstance.dismiss();
		            });

		            modal.scope.$on('$destroy', function () {
	                    clearStateChangeSuccess();
		            });

		            return open(modalInstance, modal);
		        };

		        return $delegate;
		    }]);
		}]);
})();
