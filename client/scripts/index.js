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
    'sugoiOverflow.questionDetails'
		])
	.config(function($httpProvider, $routeProvider){
		'use strict';

		$routeProvider
      .when('/login', {
        templateUrl: 'scripts/shared/templates/auth/login.html',
        controller: 'loginController'
      })
      .when('/register', {
        templateUrl: 'scripts/shared/templates/auth/register.html',
        controller: 'registerController'
      })
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
      .when('/questions/:id/answers', {
        templateUrl: 'scripts/questionDetails/templates/questionDetails.html',
        controller: 'questionDetailsController'
      })
      .when('/profile', {
        redirectTo: '/profile/me'
      })
      .when('/profile/me', {
        templateUrl: 'scripts/shared/templates/profile/viewProfile.html',
        controller: 'viewProfileController'
      })
      .when('/profile/me/edit', {
        templateUrl: 'scripts/shared/templates/profile/editProfile.html',
        controller: 'editProfileController'
      })
      .when('/profile/:username', {
        templateUrl: 'scripts/shared/templates/profile/viewProfile.html',
        controller: 'viewProfileController'
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
