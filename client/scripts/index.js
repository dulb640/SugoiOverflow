angular
	.module('sugoiOverflow',
		['ngRoute',
		'ui.bootstrap',
    'wiz.markdown',
    'ngTagsInput',
		'sugoiOverflow.settings',
    'sugoiOverflow.services',
		'sugoiOverflow.controllers',
		'sugoiOverflow.interceptors',
    'sugoiOverflow.filters'
		])
	.config(function($routeProvider){
		'use strict';

		$routeProvider
      .when('/questions/new/', {
        templateUrl: 'views/questions/newQuestion.html',
        controller: 'newQuestionController'
      })
      .when('/questions/search/:searchTerms', {
        templateUrl: 'views/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/questions/:questionFilter?', {
        templateUrl: 'views/questions/questions.html',
        controller: 'questionsController'
      })
      .when('/questions/:id/answers', {
        templateUrl: 'views/questions/answerQuestion.html',
        controller: 'answersController'
      })
      .when('/profile', {
        redirectTo: '/profile/me'
      })
      .when('/profile/me', {
        templateUrl: 'views/profile/viewProfile.html',
        controller: 'viewProfileController'
      })
      .when('/profile/me/edit', {
        templateUrl: 'views/profile/editProfile.html',
        controller: 'editProfileController'
      })
      .when('/profile/:userId', {
        templateUrl: 'views/profile/viewProfile.html',
        controller: 'viewProfileController'
      })
      .otherwise({
        redirectTo: '/questions/suggested'
      });
	});
