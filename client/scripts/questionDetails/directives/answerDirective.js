angular.module('sugoiOverflow.questionDetails')
  .directive('soAnswer', function(){
    'use strict';

    return {
      restrict: 'A',
      templateUrl: 'scripts/questionDetails/templates/answer.html',
      scope: {
        answer: '=soAnswer',
        questionId: '=soAnswerQuestionId',
        update: '=soAnswerOnUpdate',
        isOwnQuestion: '=soAnswerIsOwnQuestion'
      },
      controller: 'answerController'
    };
  });
