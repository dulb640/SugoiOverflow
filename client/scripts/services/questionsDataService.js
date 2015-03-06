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
        var QuestionMocks =  [
            {
              questionId: '1234',
              title: 'How hipster will I be if I use NodeJS to write a web server?',
              answerCount: 5,
              subCount: 9,
              score: 5,
              tags: [{text: 'This'}, {text: 'Is'}, {text: 'A'}, {text: 'Tag'}]
            },
            {
              questionId: '4321',
              title: 'How hipster will I be if I use COBOL to write a web server?',
              answerCount: 2,
              subCount: 25,
              score: 6,
              tags: [{text: 'This'}, {text: 'Is'}, {text: 'A'}, {text: 'Tag'}]
            },
            {
              questionId: '12',
              title: 'What does error code 5 mean from SaleServer',
              body: 'I\'m integrating SaleServer with my homemade internet ticketing. It keeps returning error code 5 when I call transContinue. What does it mean?',
              answers: [
                {
                  score: 150,
                  body: 'Error code 5 is execute unexpected result, which can be many things. I would suggest you check the SaleServer logs for more information.'
                },
                {
                  score: -159,
                  body: 'Why on earth would you want to try to integrate with SaleServer yourself. Just buy our amazing Vista Internet Ticketing!'
                }
              ],
              answerCount: 1,
              subCount: 0,
              score: 100,
              tags: [{text: 'SaleServer'}, {text: 'Internet Ticketing'}, {text: 'Web'}, {text: 'Custom Integration'}]
            }
          ];
        deferred.resolve(QuestionMocks);
        return deferred.promise;
      },
      getQuestion: function() {
        var deferred = $q.defer();
        var QuestionMock = {
          questionId: '12',
          title: 'What does error code 5 mean from SaleServer',
          body: 'I\'m integrating SaleServer with my homemade internet ticketing. It keeps returning error code 5 when I call transContinue. What does it mean?',
          answers: [
            {
              score: 150,
              body: 'Error code 5 is execute unexpected result, which can be many things. I would suggest you check the SaleServer logs for more information.'
            },
            {
              score: -159,
              body: 'Why on earth would you want to try to integrate with SaleServer yourself. Just buy our amazing Vista Internet Ticketing!'
            }
          ],
          answerCount: 1,
          subCount: 0,
          score: 100,
          tags: [{text: 'SaleServer'}, {text: 'Internet Ticketing'}, {text: 'Web'}, {text: 'Custom Integration'}]
        };
        deferred.resolve(QuestionMock);

        return deferred.promise;
      }

    };
    return service;
  });


