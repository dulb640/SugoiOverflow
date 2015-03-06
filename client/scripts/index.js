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
      .when('/questions/', {
        templateUrl: 'views/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/questions/new', {
        templateUrl: 'views/questions/newQuestion.html',
        controller: 'newQuestionController'
      })
      .when('/questions/:id/answers', {
        templateUrl: 'views/questions/question.html',
        controller: 'answersController'
      })
      .when('/profile/:user', {
        templateUrl: 'views/profile/profile.html',
        controller: 'profileController'
      })
      .when('/questions', {
        templateUrl: 'views/questions/questions.html',
        controller: 'questionsController'
      })
      .otherwise({
        redirectTo: '/questions'
      });
	});
