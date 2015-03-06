angular
	.module('sugoiOverflow',
		['ngMessages',
		'ui.router',
		'ui.bootstrap',
    'ngSanitize',
    'ngTagsInput',
		'sugoiOverflow.settings',
		'sugoiOverflow.shared',
		'sugoiOverflow.interceptors',
    'sugoiOverflow.profile'
		])
	.config(function($stateProvider, $urlRouterProvider, $httpProvider, settingsProvider){
		'use strict';

		$stateProvider
			.state('root', {
				templateUrl: 'Scripts/app/views/layout.html',
				abstract: true
			})
			.state('root.home', {
				url: '/',
				templateUrl: 'Scripts/app/views/questions/home.html',
			});

		$urlRouterProvider.otherwise('/');
	})
  .run(function($rootScope, $cacheFactory, $window, settings){
  	'use strict';


  	if($window.location.pathname.slice(-1) !== '/'){
  		$window.location.replace($window.location.pathname + '/');
  	}

  	$rootScope.$on('$stateChangeStart', function(){
  		var httpCache = $cacheFactory.get('$http');
  		httpCache.removeAll();
  	});

    $rootScope.$on('$stateChangeSuccess', function() {
        angular.element('html, body').animate({ scrollTop: 0 }, 200);
    });
});

