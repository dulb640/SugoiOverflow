angular.module('sugoiOverflow.questions')
  .controller('questionDetailsController',
    function($scope, $q, $routeParams, questionsDataService, currentUser){
      'use strict';

      function loadQuestion(question){
        $scope.questionId = question.id;
        $scope.title = question.title;
        $scope.body = question.body;
        $scope.tags = _.map(question.tags, function mapTags (tag) {
          return {
            text: tag
          };
        });
        $scope.author = question.author;
        $scope.timestamp = question.timestamp;
        $scope.answers = question.answers;
        $scope.subscribers = question.subscribers;
        $scope.questionComments = question.comments;
        $scope.answer = '';
        $scope.questionComment = '';
      }

      _.extend($scope, {
        submitAnswer: function(){
          questionsDataService.addAnswer($routeParams.id, $scope.answer)
            .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
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
        submitQuestionComment : function()
        {
           questionsDataService.addQuestionComment($routeParams.id, $scope.questionComment)
             .then(function(){
              questionsDataService.getQuestion($routeParams.id)
              .then(loadQuestion);
            });
        },
        loadQuestion: loadQuestion
      });

      $scope.votingInProgress = false;

      $scope.user = currentUser;

      questionsDataService.getQuestion($routeParams.id)
        .then(loadQuestion);
    }
  );
