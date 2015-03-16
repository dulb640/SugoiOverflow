angular.module('sugoiOverflow.controllers')
  .controller('answersController',
    function($scope, $q, $routeParams, questionsDataService, currentUser){
      'use strict';

      function loadQuestion(question){
        $scope.questionId = question.questionId;
        $scope.title = question.title;
        $scope.body = question.body;
        $scope.tags = _.map(question.tags, function mapTags (tag) {
          return {
            text: tag
          };
        });
        $scope.author = question.author;
        $scope.timestamp = question.timestamp;
        $scope.answers = question.answers ? question.answers :
        $scope.subscribers = question.subscribers;
        $scope.questionComments = question.comments;
        $scope.answer = '';
        $scope.questionComment = '';
        $scope.answerComment = '';
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
            return _.some($scope.subscribers, function(sub){
              sub.username = currentUser.username;
            });
          }
          return false;
        },
        isOwnQuestion: function(){
          if ($scope.author){
            if (currentUser.username === $scope.author.username){
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
          return _.some(answer.upVotes, function(upVoter){
            return upVoter.username === currentUser.username;
          });
        },
        hasDownVoted: function(answer){
          return _.some(answer.downVotes, function(downVoter){
            return downVoter.username === currentUser.username;
          });
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

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
