angular.module('sugoiOverflow.profile', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
<<<<<<< HEAD
angular.module('sugoiOverflow.profile', ['sugoiOverflow.shared', 'sugoiOverflow.settings', 'ui.router'])
  .config(['$stateProvider',
    function($stateProvider){
=======
  .config(function($stateProvider){
>>>>>>> ed00ea8e2d96e1206f93e17ea7e8ca7a116eb9d2
      'use strict';

      $stateProvider
        .state('root.profile', {
          url: '/profile',
          templateUrl: 'client/views/profile/profile.html',
          controller:'profileController'
        });
    }
  );
