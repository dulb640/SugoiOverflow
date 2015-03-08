angular.module('sugoiOverflow.services')
  .factory('profilesDataService',
    function($http, $q, mappingService) {
      'use strict';

      var service = {
        getUser: function(id) {
            var deferred = $q.defer();
            $http.get('/api/profiles/' + id)
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
            return deferred.promise;
        },

        getCurrentUserProfile: function() {
          var deferred = $q.defer();
          $http.get('/api/profiles/me')
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        getCurrentUserNotifications: function() {
          var deferred = $q.defer();
          $http.get('/api/profiles/me/feed')
            .success(function(data){
              deferred.resolve(data.questionNotifications);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },
        editProfile: function(data) {
          var profile = mappingService.mapProfileForApi(data);
          var deferred = $q.defer();
          $http.put('/api/profiles/me', profile)
            .success(function(data){
              var profile = mappingService.mapProfileForClient(data);
              deferred.resolve(profile);
            })
            .error(function(error){
              deferred.reject(error);
            });
          return deferred.promise;
        },

        getSuggestedUsers: function() {
            var deferred = $q.defer();
            // $http.get('/api/user/' + userId)
            // .success(function(data){
            //   deferred.resolve(data);
            // })
            // .error(function(error){
            //   deferred.reject(error);
            // });

            var UserMocks = function() {
                return [{
                    userId: '2836',
                    name: 'Jacky Zhen',
                    profilePictureUrl: 'http://www.connectsavannah.com/binary/bfdc/tom_selleck.jpg',
                    karma: 897,
                    location: 'Level 3',
                    tags: [{
                        name: 'Veezi',
                        text: 'Veezi'
                    }]
                }, {
                    userId: '234',
                    name: 'Sanchit Uttam',
                    profilePictureUrl: 'http://www.connectsavannah.com/binary/bfdc/tom_selleck.jpg',
                    karma: -97,
                    location: 'Level 1',
                    tags: [{
                        name: 'Web',
                        text: 'Web'
                    }, {
                        name: 'GroupSales',
                        text: 'Group Sales'
                    }, {
                        name: 'Bikes',
                        text: 'Bikes'
                    }]
                }, {
                    userId: '1',
                    name: 'Alex Bossman',
                    profilePictureUrl: 'http://www.connectsavannah.com/binary/bfdc/tom_selleck.jpg',
                    karma: 10000000,
                    location: 'Level 1',
                    tags: [{
                        name: 'Web',
                        text: 'Web'
                    }, {
                        name: 'GroupSales',
                        text: 'Group Sales'
                    }, {
                        name: 'GrowingMarijuana',
                        text: 'Growing Marijuana'
                    }]
                }, {
                    userId: '2',
                    name: 'Giang Nguyen',
                    profilePictureUrl: 'http://www.connectsavannah.com/binary/bfdc/tom_selleck.jpg',
                    karma: 10000000,
                    location: 'Level 1',
                    tags: [{
                        name: 'Web',
                        text: 'Web'
                    }, {
                        name: 'GroupSales',
                        text: 'Group Sales'
                    }, {
                        name: 'Lifting',
                        text: 'Lifting'
                    }, {
                        name: 'Gainz',
                        text: 'Gainz'
                    }]
                }];
            };


            deferred.resolve(new UserMocks());
            return deferred.promise;
        }
    };


    return service;


});
