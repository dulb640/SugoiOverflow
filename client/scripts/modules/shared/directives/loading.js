angular.module('sugoiOverflow.shared')
    .directive('soLoading', [function () {
        'use strict';
        var template = '<div class="loading-mask"><div class="display">\
            <div class="spinner"></div>\
           </div></div>';

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var spinner = angular.element(template);
                element.prepend(spinner);
                var checkLoading = function(){
                    return scope.$eval(attrs.gsLoading);
                };
                var isLoading = checkLoading();
                var loadDelayComplete = true;
                scope.$watch(
                    function() {
                        isLoading = checkLoading();
                        return isLoading;
                    },
                    function() {
                        if (isLoading) {
                            loadDelayComplete = false; 
                            setTimeout(function(){
                                 loadDelayComplete = true;
                                 if(!isLoading) {
                                     element.removeClass('loading');
                                     spinner.hide();
                                 }
                            }, 400);
                            element.addClass('loading');
                            spinner.show();
                        } else {
                            if(loadDelayComplete) {
                                element.removeClass('loading');
                                spinner.hide();
                            }
                        }
                    });
            }
        };
    }]);
