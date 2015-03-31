/**
 * @ngdoc directive
 * @name soAnswer
 * @memberOf sugoiOverflow.questions
 * @description
 * Renders answer.
 * @scope
 * @param {string} so-answer Answer model.
 * @param {string} so-answer-question-id Id of viewed question.
 * @param {function} so-answer-on-update Function to be called after upvoting/downvoting,
 * subscribing, marking as correct and other actions.
 * @param {function} so-answer-is-own-question Function called to determine if question asked by current user.
 * @requires sugoiOverflow.questions.answerController
 */
angular.module('sugoiOverflow.questions')
  .directive('soAnswer', function(){
    'use strict';

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/answer.html',
      scope: {
        answer: '=soAnswer',
        questionId: '=soAnswerQuestionId',
        update: '=soAnswerOnUpdate',
        isOwnQuestion: '=soAnswerIsOwnQuestion'
      },
      controller: 'answerController'
    };
  });
