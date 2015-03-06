angular
	.module('sugoiOverflow',
		['ngRoute',
		'ui.bootstrap',
		'sugoiOverflow.settings',
    'sugoiOverflow.services',
		'sugoiOverflow.controllers',
		'sugoiOverflow.interceptors'
		])
	.config(function($routeProvider){
		'use strict';

		$routeProvider
      .when('/questions/:questionFilter?', {
        templateUrl: 'views/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/new-question/', {
        templateUrl: 'views/questions/newQuestion.html',
        controller: 'newQuestionController'
      })
      .when('/questions/:id/answers', {
        templateUrl: 'views/questions/question.html',
        controller: 'answersController'
      })
      .when('/profile/:userId?', {
        templateUrl: 'views/profile/profile.html',
        controller: 'profileController'
      })
      .otherwise({
        redirectTo: '/questions/'
      });
	});
