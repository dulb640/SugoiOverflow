/* global angular*/
/**
 * so-answer-on-update Function to be called after upvoting/downvoting,
 * subscribing, marking as correct and other actions.
 * so-answer-is-own-question Function called to determine if question asked by current user.
 * requires sugoiOverflow.questions.answerController
 */
angular.module('sugoiOverflow.questions')
  .directive('soEditQuestion', function () {
    'use strict'

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/editQuestion.html',
      scope: {
        questionIdInput: "=soEditQuestion",
        titleInput: "=soTitle",
        bodyInput: "=soBody",
        tagsInput: "=soTags",
        peopleInput: "=soPeople",
        submit: "=soSubmit",
        submitText: "=soSubmitText"
      },
      controller: 'editQuestionController'
    }
  })