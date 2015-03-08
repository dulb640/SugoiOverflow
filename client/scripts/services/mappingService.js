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
          timestamp:   question.timestamp,
          user:        question.user,
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
          timestamp:  answer.timestamp,
          author:     service.mapAuthorForClient(answer.author)
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
      mapAuthorForClient: function mapProfile(profile){
        return {
          id: profile.id,
          name: profile.name,
          karma: profile.karma,
          location: profile.location,
          profilePictureUrl: profile.profilePictureUrl,
        };
      },
      mapProfileForClient: function mapProfile(profile){
        return {
          id: profile.id,
          name: profile.name,
          tags: _.map(profile.selectedTags, service.mapTagForClient),
          karma: profile.karma,
          location: profile.location,
          profilePictureUrl: profile.profilePictureUrl,
        };
      },

      mapProfileForApi: function mapProfile(profile){
        return {
          name: profile.name,
          selectedTags: _.map(profile.tags, service.mapTagForApi),
          karma: profile.karma,
          location: profile.location,
          profilePictureUrl: profile.profilePictureUrl,
        };
      }
    };

    return service;
  });


