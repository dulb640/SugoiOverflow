angular.module('sugoiOverflow.services')
  .factory('questionsDataService',
  function($http, $q){
    'use strict';
    var service = {
      getQuestionsList: function(){
        var deferred = $q.defer();
        // $http.get('/api/tags/' + query)
        // .success(function(data){
        //   deferred.resolve(data);
        // })
        // .error(function(error){
        //   deferred.reject(error);
        // });
        var QuestionMocks = function(){
          return [
            {
              questionId: '1234',
              title: 'How hipster will I be if I use NodeJS to write a web server?',
              answerCount: 5,
              subCount: 9,
              tags: [{text: 'This'}, {text: 'Is'}, {text: 'A'}, {text: 'Tag'}]
            },
            {
              questionId: '4321',
              title: 'How hipster will I be if I use COBOL to write a web server?',
              answerCount: 2,
              subCount: 25,
              tags: [{text: 'This'}, {text: 'Is'}, {text: 'A'}, {text: 'Tag'}]
            }
          ];
        };
        deferred.resolve(new QuestionMocks());
        return deferred.promise;
      }
    };
    return service;
  });


