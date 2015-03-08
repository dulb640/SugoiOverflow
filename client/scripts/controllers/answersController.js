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

        $scope.answer = '';

        if (question.upVotes.indexOf($scope.currentUserId) !== -1 || question.downVotes.indexOf($scope.currentUserId) !== -1){
          $scope.hasUserVoted = true;
        }
      }

      _.extend($scope, {
        submitAnswer: function(){
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(loadQuestion);
        },
        upvoteAnswer: function(answer){
          $scope.hasUserVoted = true;
          questionsDataService.upvoteAnswer($routeParams.id, answer)
            .then(loadQuestion); //TODO: Need to develop a way to prevent users from upvoting answers multiple times
        },
        downvoteAnswer: function(answer){
          $scope.hasUserVoted = true;
          questionsDataService.downvoteAnswer($routeParams.id, answer)
            .then(loadQuestion); //TODO: Need to develop a way to prevent users from downvoting answers multiple times
        }
      });

      $scope.currentUserId = '';

      $scope.hasUserVoted = false;

      profilesDataService.getCurrentUserProfile().then(function(user){$scope.currentUserId = user.id;});

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
