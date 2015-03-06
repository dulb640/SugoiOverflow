angular.module('sugoiOverflow.shared')
    .factory('eventAggregator', function ($rootScope) {
        'use strict';

    var raiseEvent = function(eventName, data) {
        $rootScope.$emit(eventName, data);
    };

    var bindEvent = function ($scope, eventName, eventHandler) {
        var unbind = $rootScope.$on(eventName, eventHandler);
        $scope.$on('$destroy', unbind);
        return unbind;
    };

    var unbindEvent = function ($scope, unbind) {
        $scope.$off('$destroy', unbind);
        unbind();
    };

    return {
        raiseEvent: raiseEvent,
        bindEvent: bindEvent,
        unbindEvent: unbindEvent,
        events: {
            currentUserServiceInitialised: 'currentUserServiceInitialised',
        }
    };
});
