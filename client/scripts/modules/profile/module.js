angular.module('sugoiOverflow.profile', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
angular.module('sugoiOverflow.profile', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
  .config(['$stateProvider',
    function($stateProvider){
      'use strict';

      $stateProvider
        .state('root.profile', {
          url: '/profile',
          templateUrl: 'client/views/profile/profile.html'
          controller:'profileController'
        })
    }
  ]);
