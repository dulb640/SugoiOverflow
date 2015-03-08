angular.module('sugoiOverflow.controllers')
  .controller('siteHeaderController',
    function ($rootScope, $scope, $location, $routeParams, $interval, profilesDataService, tagsDataService) {
    'use strict';

    _.extend($scope, {
      notifications: [],
      notificationsOpened: false,
      user: {},
      searchTerms: '',
      searchQuestions: function(){
        $location.path(_.str.sprintf('/questions/search/%s', $scope.searchTerms));
      },
      getTypeahead: function(){
        $scope.typeaheadLoading = true;
        return tagsDataService.getAvailableTags()
        .then(function(tags){
          return tags;
        })
        .finally(function(){
          $scope.typeaheadLoading = false;
        });
      },
      newNotificationsCount: function(){
        return _.where($scope.notifications, {'read' : false}).length;
      },
      readNotification: function(notification){
        $scope.notificationsOpened = false;
        profilesDataService.markNotificationAsRead(notification.id)
          .then(function(notifications){
            $scope.notifications = notifications;
          });

        $location.path(_.str.sprintf('/questions/%s/answers', notification.question));
      },
      openNotifications: function(){
        $scope.notificationsOpened = true;
      },
      closeNotifications: function(){
        $scope.notificationsOpened = false;
      },
      hasNewNotifications : function (){
        return $scope.newNotificationsCount() > 0;
      }

    });

    if($routeParams.searchTerms){
      $scope.searchTerms = $routeParams.searchTerms;
    }

    profilesDataService.getCurrentUserProfile()
    .then(function(user){
      $scope.user = user;
      $scope.notifications = user.notifications;
    });

    function getNotifications(){
      profilesDataService.getCurrentUserNotifications()
      .then(function(notifications){
        $scope.notifications = notifications;
      });
    }

    getNotifications();

    $interval(getNotifications, 60000);

    $rootScope.$on('$routeChangeSuccess', function(){
      $scope.searchTerms = $routeParams.searchTerms;
    });
  });
