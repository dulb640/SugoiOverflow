angular.module('sugoiOverflow.services')
  .factory('questionsDataService',
  function($http, $q){
    'use strict';

    function mapTag(tag){
      return{
        text: tag
      };
    }

    function mapQuestion(question){
      return {
        questionId: question._id,
        title: question.title,
        answerCount: question.answers.length,
        subCount: question.subscribers.length,
        score: 5, //wtf is score?
        tags: _.map(question.tags, mapTag)
      };
    }

    var service = {
      getQuestionsList: function(){
        var deferred = $q.defer();
        $http.get('/api/questions/')
        .success(function(data){
          var questions = _.map(data, mapQuestion);
          deferred.resolve(questions);
        })
        .error(function(error){
          deferred.reject(error);
        });
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


