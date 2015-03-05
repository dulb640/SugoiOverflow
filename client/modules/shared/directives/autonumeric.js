(function () {
    'use strict';

    var processLink = function(scope, elm, attrs, controller, autonumericOptions, parserFunction) {
        var isTextInput = elm.is('input:text');

        // Helper method to update autoNumeric with new value.
        var updateElement = function(element, newVal) {
            // Only set value if value is numeric
            if(!newVal && newVal !== 0) {
                element.autoNumeric('wipe');
            }else if ($.isNumeric(newVal)) {
                element.autoNumeric('set', newVal);
            }
        };

        // Initialize element as autoNumeric with options.
        elm.autoNumeric(autonumericOptions);

        // if element has controller, wire it (only for <input type="text" />)
        if (controller && isTextInput) {
            // render element as autoNumeric
            controller.$render = function() {
                updateElement(elm, controller.$viewValue);
            };
            // Detect changes on element and update model.
            elm.on('change', function() {
                scope.$apply(function() {
                    controller.$setViewValue(elm.autoNumeric('get'));
                });
            });
        } else {
            // Listen for changes to value changes and re-render element.
            // Useful when binding to a readonly input field.
            if (isTextInput) {
                attrs.$observe('value', function(val) {
                    updateElement(elm, val);
                });
            }
        }

        if (parserFunction) {
            controller.$parsers.push(parserFunction);
        }
    };

    // Directive for autoNumeric.js
    // Require AngularJS, jQuery and autoNumeric.js
    // original source from https://gist.github.com/kwokhou/5964296
    angular.module('sugoiOverflow.shared').directive('soAutonumeric', [
        function() {
            
            return {
                // Require ng-model in the element attribute for watching changes.
                require: '?ngModel',
                // This directive only works when used in element's attribute (e.g: gs-autonumeric)
                restrict: 'A',
                compile: function () {
                    return function (scope, elm, attrs, controller) {
                        var autoNumericOptions = scope.$eval(attrs.gsAutonumeric);
                        processLink(scope, elm, attrs, controller,  autoNumericOptions, null);
                    };
                }
            }; 
        }
    ]);

    //Standard integer-input
    angular.module('sugoiOverflow.shared').directive('soIntegerInput', [function () {

            //Default to 0 decimal places with no currency symbol
            var integerAutonumericOptions = {
                aSep: '',
                mDec: 0,
                vMin: 0, 
            };
            var convertToNumber = function(stringValue) {
                if (stringValue) {
                    return parseInt(stringValue);
                }
                return null;
            };
            return {
                // Require ng-model in the element attribute for watching changes.
                require: '?ngModel',
                // This directive only works when used in element's attribute (e.g: gs-autonumeric)
                restrict: 'A',
                compile: function () {
                    return function (scope, elm, attrs, controller) {
                        processLink(scope, elm, attrs, controller, integerAutonumericOptions, convertToNumber);
                    };
                }
            }; 
        }
    ]);
})();