angular.module('sugoiOverflow.services')
  .factory('mappingService',
  function(){
    'use strict';

    var service = {
      mapTagForClient: function mapTagForClient(tag){
        return{
          text: tag
        };
      },

      mapTagForApi: function mapTagForApi(tag){
        return tag.text;
      },

      mapQuestionForList: function mapQuestionForList(question){
        return {
          questionId:  question.id,
          title:       question.title,
          answerCount: question.answers.length,
          subCount:    question.subscribers.length,
          tags:        _.map(question.tags, service.mapTagForClient)
        };
      },

      mapAnswerForClient: function mapAnswerForClient(answer){
        return{
          id:         answer.id,
          downVotes:  answer.downVotes,
          upVotes:    answer.upVotes,
          score:      answer.upVotes.length - answer.downVotes.length,
          body:       answer.body,
          correct:    answer.correct,
          timestamp:  answer.timestamp
        };
      },

      mapQuestionForClient: function mapQuestionForClient(question){
        return {
          id: question.id,
          title: question.title,
          body: question.body,
          answerCount: question.answers.length,
          subCount: question.subscribers.length,
          user: question.user,
          timestamp:  question.timestamp,
          tags: _.map(question.tags, service.mapTagForClient),
          answers: _.map(question.answers, service.mapAnswerForClient)
        };
      },

      mapQuestionForApi: function mapQuestionForApi(question){
        return {
          title: question.title,
          body: question.body,
          tags: _.map(question.tags, service.mapTagForApi)
        };
      },

      mapProfile: function mapProfile(profile){
        return {
          userId: profile.id,
          name: profile.name,
          tags: _.map(profile.tags, service.mapTag),
          karma: profile.karma,
          location: profile.location,
          //profilePictureUrl:
        };
      }
    };

    return service;
  });


