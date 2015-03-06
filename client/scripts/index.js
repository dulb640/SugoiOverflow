angular
	.module('sugoiOverflow',
		['ngMessages',
		'ui.router',
		'ui.bootstrap',
    'ngSanitize',
    'ngTagsInput',
    //'wiz.markdown',
		'sugoiOverflow.settings',
		'sugoiOverflow.shared',
		'sugoiOverflow.interceptors',
    'sugoiOverflow.profile',
    'sugoiOverflow.questions'
		])
	.config(function($stateProvider, $urlRouterProvider){
		'use strict';

		$stateProvider
			.state('root', {
				templateUrl: '/views/layout.html',
				abstract: true
			})
			.state('root.home', {
				url: '/',
				templateUrl: '/views/questions/questions.html',
			});

		$urlRouterProvider.otherwise('/');
	})
  .run(function($rootScope, $cacheFactory, $window){
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

