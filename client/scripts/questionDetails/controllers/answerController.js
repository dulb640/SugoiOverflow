angular.module('sugoiOverflow.questionDetails')
  .controller('answerController',
    function($scope, questionsDataService, currentUser){
      'use strict';

      _.extend($scope, {
        submitComment : function () {
          questionsDataService.addAnswerComment($scope.questionId, $scope.answer.id, $scope.commentBody)
            .then($scope.update);
        },
        markAsCorrect: function(){
          if ($scope.isOwnQuestion()){
            questionsDataService.markAnswerAsCorrect($scope.questionId, $scope.answer.id)
              .then($scope.update);
          }
        },
        hasUpVoted: function(){
          return _.some($scope.answer.upVotes, function(upVoter){
            return upVoter.username === currentUser.username;
          });
        },
        hasDownVoted: function(){
          return _.some($scope.answer.downVotes, function(downVoter){
            return downVoter.username === currentUser.username;
          });
        },
        upvote: function(){
          if ($scope.hasUpVoted()){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.upvoteAnswer($scope.questionId, $scope.answer.id)
              .then(function(){
                questionsDataService.getQuestion($scope.questionId)
                .then($scope.update);
                $scope.votingInProgress = false;});
          }
        },
        downvote: function(){
          if ($scope.hasDownVoted()){
            return;
          }
          if (!$scope.votingInProgress){
            $scope.votingInProgress = true;
            questionsDataService.downvoteAnswer($scope.questionId, $scope.answer.id)
              .then(function(){
                questionsDataService.getQuestion($scope.questionId)
                .then($scope.update);
                $scope.votingInProgress = false;
              });
          }
        },
      });
    }
  );
