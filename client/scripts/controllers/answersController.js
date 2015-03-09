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
        $scope.answers = question.answers ? question.answers :
        $scope.subscribers = question.subscribers;
        $scope.questionComments = question.comments;
        $scope.answer = '';
        $scope.questionComment = '';
        $scope.answerComment = '';
        $scope.isSubscribed = question.subscribers.indexOf($scope.currentUserId) !== -1;
      }

      _.extend($scope, {
        submitAnswer: function(){
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
        },
        upvoteAnswer: function(answer){
          if ($scope.hasUpVoted(answer)){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.upvoteAnswer($routeParams.id, answer)
              .then(function(){
                questionsDataService.getQuestion($routeParams.id)
                .then(loadQuestion);
                $scope.votingInProgress = false;});
          }
        },
        downvoteAnswer: function(answer){
          if ($scope.hasDownVoted(answer)){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.downvoteAnswer($routeParams.id, answer)
              .then(function(){
                questionsDataService.getQuestion($routeParams.id)
                .then(loadQuestion);
                $scope.votingInProgress = false;
              });
          }
        },
        subscribeToQuestion: function(){
          questionsDataService.subscribeToQuestion($routeParams.id)
            .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
        },
        isSubscribed: function(){
          if ($scope.subscribers){
            return $scope.subscribers.indexOf($scope.currentUserId) !== -1;
          }
          return false;
        },
        isOwnQuestion: function(){
          if ($scope.author){
            if ($scope.currentUserId === $scope.author.id){
              return true;
            }
          }
          return false;
        },
        markAsCorrect: function(answer){
          if ($scope.isOwnQuestion()){
            questionsDataService.markAnswerAsCorrect($routeParams.id, answer)
              .then(loadQuestion);
          }
        },
        hasUpVoted: function(answer){
          return answer.upVotes.indexOf($scope.currentUserId) !== -1;
        },
        hasDownVoted: function(answer){
          return answer.downVotes.indexOf($scope.currentUserId) !== -1;
        },
        submitQuestionComment : function()
        {
           questionsDataService.addQuestionComment($routeParams.id, $scope.questionComment)
             .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
        },
        submitAnswerComment : function (answer)
        {
           questionsDataService.addAnswerComment($routeParams.id, answer.id, answer.answerComment)
            .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
        }
      });

      $scope.votingInProgress = false;

      $scope.currentUserId = '';

      profilesDataService.getCurrentUserProfile().then(function(user){$scope.currentUserId = user.id;});

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
