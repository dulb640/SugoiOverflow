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
          if ($scope.hasUpVoted(answer)){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.upvoteAnswer($routeParams.id, answer)
              .then(loadQuestion)
              .then(function(){$scope.votingInProgress = false;});
          }
        },
        downvoteAnswer: function(answer){
          if ($scope.hasDownVoted(answer)){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.downvoteAnswer($routeParams.id, answer)
              .then(loadQuestion)
              .then(function(){$scope.votingInProgress = false;});
          }
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
        },
        hasUpVoted: function(answer){
          return answer.upVotes.indexOf($scope.currentUserId) !== -1;
        },
        hasDownVoted: function(answer){
          return answer.downVotes.indexOf($scope.currentUserId) !== -1;
        }
      });

      $scope.votingInProgress = false;

      $scope.currentUserId = '';

      profilesDataService.getCurrentUserProfile().then(function(user){$scope.currentUserId = user.id;});

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
