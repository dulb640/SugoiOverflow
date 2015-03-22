angular
	.module('sugoiOverflow',
		['ngRoute',
    'angular-jwt',
    'ngStorage',
    'ngMessages',
		'ui.bootstrap',
    'angularFileUpload',
    'wiz.markdown',
    'ngTagsInput',
    'pageslide-directive',
    'sugoiOverflow.templates',
		'sugoiOverflow.settings',
    'sugoiOverflow.shared',
		'sugoiOverflow.interceptors',
    'sugoiOverflow.questionDetails',
    'sugoiOverflow.profile',
    'sugoiOverflow.auth'
		])
	.config(function($httpProvider, $routeProvider){
		'use strict';

		$routeProvider
      .when('/questions/new/', {
        templateUrl: 'scripts/shared/templates/questions/newQuestion.html',
        controller: 'newQuestionController'
      })
      .when('/questions/search/:searchTerms', {
        templateUrl: 'scripts/shared/templates/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/questions/:questionFilter?', {
        templateUrl: 'scripts/shared/templates/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/logout', {
        template: '',
        controller: function($location, authService){
          authService.logout()
            .then(function(){
              $location.path('/login');
            });
        }
      })
      .otherwise({
        redirectTo: '/questions/suggested'
      });
	});
