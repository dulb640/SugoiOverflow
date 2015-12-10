/* global angular*/
/**
 * 
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