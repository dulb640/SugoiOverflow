/* global angular*/
/**
 * so-edit-question: currently unused
 *
 * so-title, so-body, so-tags, so-people:
 * These fields will have whatever is currently in the different input boxes.
 *
 * so-submit: The function that will be called when the user finishes editing.
 *
 * so-submit-text: The text that will be displayed on the submit button.
 *
 * so-cancel: The function that will be called when the user cancels editing.
 * If this is undefined, the button will not appear.
 *
 * so-cancel-text: The text that will be displayed on the cancel button.
 *
 * requires sugoiOverflow.questions.editQuestionController
 */
angular.module('sugoiOverflow.questions')
  .directive('soEditQuestion', function () {
    'use strict'

    return {
      restrict: 'A',
      templateUrl: 'scripts/questions/templates/editQuestion.html',
      scope: {
        question: "=soEditQuestion",
        titleInput: "=soTitle",
        bodyInput: "=soBody",
        tagsInput: "=soTags",
        peopleInput: "=soPeople",
        cancel: "=soCancel",
        cancelText: "=soCancelText",
        submit: "=soSubmit",
        submitText: "=soSubmitText",
        delete: "=soDelete",
        deleteText: "=soDeleteText"
      },
      controller: 'editQuestionController'
    }
  })