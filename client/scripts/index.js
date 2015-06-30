/* global angular*/
/**
  * @namespace sugoiOverflow
  */
angular
	.module('sugoiOverflow',
		['ngRoute',
    'change-case',
    'ngAnimate',
    'angular-jwt',
    'ngStorage',
    'ngMessages',
		'ui.bootstrap',
    'angularFileUpload',
    'wiz.markdown',
    'ngTagsInput',
    'pageslide-directive',
		'ngJoyRide',
    'sugoiOverflow.templates',
		'sugoiOverflow.settings',
    'sugoiOverflow.shared',
		'sugoiOverflow.interceptors',
    'sugoiOverflow.questions',
    'sugoiOverflow.profile',
    'sugoiOverflow.auth'
		])
	.config(function ($httpProvider, $routeProvider) {
  'use strict'

  $routeProvider
    .otherwise({
      redirectTo: '/questions/suggested'
    })
	})
  .run(function ($rootScope, $location, currentUser) {
    'use strict'

    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (!currentUser.isAuthenticated && next.isSecured) {
        $location.path('/login')
      }
    })
  })
