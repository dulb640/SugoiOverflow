angular.module('sugoiOverflow.shared')
  .controller('siteHeaderController',
    function ($rootScope,
      $scope,
      $location,
      $routeParams,
      $interval,
      $window,
      profilesDataService,
      currentUser,
      tagsDataService) {
    'use strict';
    _.extend($scope, {
        currentUser: currentUser,
        user: {},
        notifications: [],
        notificationsOpened: false,
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
        openNotifications: function(event){
          $scope.notificationsOpened = true;
          event.stopPropagation();
        },
        closeNotifications: function(){
          $scope.notificationsOpened = false;
        },
        hasNewNotifications : function (){
          return $scope.newNotificationsCount() > 0;
        }

      });

    $window.onclick = function(){
      if ($scope.notificationsOpened){
        $scope.closeNotifications();
        $scope.$apply();
      }
    };

    if($routeParams.searchTerms){
      $scope.searchTerms = $routeParams.searchTerms;
    }

    function getUpdates(){
      if(!currentUser.isAuthenticated){
        return;
      }

      profilesDataService.getCurrentUserNotifications()
        .then(function(notifications){
          $scope.notifications = notifications;
        });

      profilesDataService.getCurrentUserProfile()
        .then(function(user){
          $scope.user = user;
        });
    }

    getUpdates();

    $interval(getUpdates, 60000);

    $scope.$watch('currentUser.isAuthenticated', getUpdates);

    $rootScope.$on('$routeChangeSuccess', function(){
      $scope.searchTerms = $routeParams.searchTerms;
    });
  });
