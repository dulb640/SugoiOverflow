/* global angular*/
/**
 * so-answer-on-update Function to be called after upvoting/downvoting,
 * subscribing, marking as correct and other actions.
 * so-answer-is-own-question Function called to determine if question asked by current user.
 * requires sugoiOverflow.questions.answerController
 */
angular.module('sugoiOverflow.questions')
  .directive('soComment', function () {
    'use strict'

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/comment.html',
      scope: {
        comment: '=soComment',
        submitEdit: '=soSubmitEdit',
      },
      controller: 'commentController'
    }
  })