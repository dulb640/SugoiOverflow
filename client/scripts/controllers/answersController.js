angular.module('sugoiOverflow.controllers')
  .controller('answersController',
    function($scope, $q, $routeParams, questionsDataService, profilesDataService){
      'use strict';

      function loadQuestion(question){
        $scope.questionId = question.questionId;
        $scope.title = question.title;
        $scope.body = question.body;
        $scope.tags = question.tags;
        $scope.author = question.author;
        $scope.timestamp = question.timestamp;
        $scope.answers = question.answers;
        $scope.subscribers = question.subscribers;
        $scope.answer = '';
      }

      _.extend($scope, {
        submitAnswer: function(){
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(loadQuestion);
        },
        upvoteAnswer: function(answer){
          if (answer.upVotes.indexOf($scope.currentUserId) !== -1){
            return;
          }
          questionsDataService.upvoteAnswer($routeParams.id, answer)
            .then(loadQuestion);
        },
        downvoteAnswer: function(answer){
          if (answer.downVotes.indexOf($scope.currentUserId) !== -1){
            return;
          }
          questionsDataService.downvoteAnswer($routeParams.id, answer)
            .then(loadQuestion);
        },
        subscribeToQuestion: function(){
          questionsDataService.subscribeToQuestion($routeParams.id)
            .then(loadQuestion);
        },
        isSubscribed: function(){
          if ($scope.subscribers){
            return $scope.subscribers.indexOf($scope.currentUserId) !== -1;
          }
          return false;
        }
      });

      $scope.currentUserId = '';

      profilesDataService.getCurrentUserProfile().then(function(user){$scope.currentUserId = user.id;});

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
