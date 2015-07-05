/* global angular*/
angular.module('sugoiOverflow.questions')
  .directive('markdownToolbar', function () {
    'use strict'

    return {
      restrict: 'E',
      templateUrl: 'scripts/questions/templates/markdownToolbar.html',
      link: function ($scope, element, attrs) {
        var input = angular.element('#' + attrs.inputId)
        $scope.replaceSelected = function replaceSelected (command) {
          var value = input.val()
          var len = value.length
          var start = input[0].selectionStart
          var end = input[0].selectionEnd
          var selection = value.substring(start, end)
          var processingCommand = $scope.commands[command]
          var processed = processingCommand(selection)
          var result = value.substring(0, start) + processed + value.substring(end, len)
          input.val(result)
          input[0].selectionStart = start
          input[0].selectionEnd = start + processed.length
        },
        $scope.insertAtSelection = function insertAtSelection (text) {
          var value = input.val()
          var start = input[0].selectionStart
          var result = value.substring(0, start) + text + value.slice(start, value.length)
          input.val(result)
          input[0].selectionStart = start
          input[0].selectionEnd = start + text.length
        }
      },
      controller: function ($scope, markdownToolset, $modal) {
        $scope.commands = markdownToolset
        $scope.insertLink = function insertLink () {
          $modal.open({
            templateUrl: 'scripts/questions/templates/addLinkModal.html',
            controller: 'addLinkController'
          }).result.then(function (item) {
            var link = markdownToolset.link(item.url, item.text)
            $scope.insertAtSelection(link)
          })
        }
      }
    }
  })
