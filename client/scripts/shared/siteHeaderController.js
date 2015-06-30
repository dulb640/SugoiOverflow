/* global angular*/
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
      $localStorage,
      tagsDataService,
      configService) {
      'use strict'

      configService.then(function (conf) {
        $scope.config = conf
      })

      function showTour () {
        $scope.joyRideStarted = true
        $localStorage.visitedTour = new Date()
      }

      window._.extend($scope, {
        currentUser: currentUser,
        user: {},
        notifications: [],
        notificationsOpened: false,
        searchTerms: '',
        searchQuestions: function () {
          $location.path(window.s.sprintf('/questions/search/%s', $scope.searchTerms))
        },
        getTypeahead: function () {
          $scope.typeaheadLoading = true
          return tagsDataService.getAvailableTags()
          .then(function (tags) {
            return tags
          })
          .finally(function () {
            $scope.typeaheadLoading = false
          })
        },
        newNotificationsCount: function () {
          return window._.where($scope.notifications, {'read': false}).length
        },
        readNotification: function (notification) {
          $scope.notificationsOpened = false
          profilesDataService.markNotificationAsRead(notification.id)
            .then(function (notifications) {
              $scope.notifications = notifications
            })

          $location.path(window.s.sprintf('/questions/%s/answers', notification.question))
        },
        openNotifications: function (event) {
          $scope.notificationsOpened = true
          event.stopPropagation()
        },
        closeNotifications: function () {
          $scope.notificationsOpened = false
        },
        hasNewNotifications: function () {
          return $scope.newNotificationsCount() > 0
        },
        joyRideStarted: false,
        startJoyRide: showTour,
        joyRideConfig: [{
          type: 'locationwindow._change',
          path: '/questions/all'
        }, {
          type: 'title',
          heading: 'Welcome',
          text: 'Welcome to interactive tour'
        }, {
          type: 'element',
          selector: '.content.container',
          heading: 'Questions',
          text: 'You can see questions asked by other users here',
          placement: 'top',
          scroll: false,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.question-content:first .tags',
          heading: 'Tags',
          text: 'Those are tags. All questions should be marked with certain tags so that it will be easy to find them in system and group by certain topics. If you click on tag it will automatically transfer you to search page for this tag',
          placement: 'right',
          scroll: false,
          attachToBody: true
        }, {
          type: 'function',
          fn: function () {
            angular.element('.question-content:first .tags a:first').click()
          }
        }, {
          type: 'element',
          selector: '.search-bar',
          heading: 'Search',
          text: 'You can see that clicked tag is now entered in search bar.',
          placement: 'right',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.content.container',
          heading: 'Search results',
          text: 'And search results are now displayed',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.toolbar',
          heading: 'Tabs',
          text: 'You can also select different tabs to switch displayed questions. Like suggested questions.',
          placement: 'bottom',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/questions/suggested'
        }, {
          type: 'element',
          selector: '.content.container',
          heading: 'Suggested questions',
          text: 'Keep in mind that suggested page will be empty unless you specify favourite tags on your profile page',
          placement: 'bottom',
          scroll: false,
          attachToBody: true
        }, {
            type: 'function',
            fn: function () {
              angular.element('.profile .dropdown-toggle').click()
            }
          }, {
          type: 'element',
          selector: '.profile-menu',
          heading: 'Profile',
          text: 'You can navigate to your profile page by clicking on your username in header and than choosing "profile" item',
          placement: 'left',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/profile/me'
        }, {
          type: 'element',
          selector: '.profile-questions',
          heading: 'Your questions',
          text: 'All questions that you ask, answer or subscribe to will be displayed at the bottom here',
          placement: 'top',
          scroll: false,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.edit-profile a',
          heading: 'Edit profile',
          text: 'You can edit your details by clicking on this link',
          placement: 'right',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/profile/me/edit'
        }, {
          type: 'element',
          selector: '.profile .avatar',
          heading: 'Change avatar',
          text: 'You can change user picture if you click on it. It\'s instantly saved',
          placement: 'right',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.profile-form input.location',
          heading: 'Location',
          text: 'Specify where other users can easily find you, like "13th floor, near big weird looking plant"',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.profile-form tags-input',
          heading: 'Specialisations',
          text: 'Specify tags that you follow, like "web product-name team-web2". Press space to separate tags, if your tag supposed to have space in it - use dash(-) instead',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: '.ask-button',
          heading: 'New question',
          text: 'You can ask new question by clicking this button',
          placement: 'left',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/questions/new'
        }, {
          type: 'element',
          selector: 'form input[name=\'title\']',
          heading: 'Title',
          text: 'When ask new question - provide meaningful title for it, so that other people will easily find it',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: 'form .markdown-editor',
          heading: 'Question body',
          text: 'All questions and answers use familiar markdown to edit them. You can read more about markdown <a target="window._blank" href="http://daringfireball.net/projects/markdown/syntax">here</a>',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: 'form tags-input[name=\'tags\']',
          heading: 'Tags',
          text: 'Add tags that describe your question well. Again remember that you should use dashes(-) instead of spaces',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: 'form tags-input[name=\'people\']',
          heading: 'Who can answer',
          text: 'You can add emails of people who you know that can answer this question. This is NOT required to post a question',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/questions/all'
        }, {
          type: 'function',
          fn: function () {
            angular.element('.question-container.has-answers:first .title a:first').click()
          }
        }, {
          type: 'title',
          heading: 'Question page',
          text: 'This is a question page. Everyrhing on this page mostly replecates elements from other pages'
        }, {
          type: 'element',
          selector: '.score-container',
          heading: 'Rate answers',
          text: 'Except this - you can rate answers to make other users know if they were useful. If you were the author of the question you can also mark them as correct',
          placement: 'left',
          scroll: true,
          attachToBody: true
        }, {
          type: 'title',
          heading: 'The End',
          text: 'Thank you for your time. Please remember that this software is still on early stage of development and your feedback is crucial for us.'
        }, {
          type: 'element',
          selector: 'footer a',
          heading: 'Feedback',
          text: 'You can always submit a bug, feature request or pull request on our github page',
          placement: 'top',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: 'header .help-tour a',
          heading: 'Run again',
          text: 'You can always run this tour again here.',
          placement: 'bottom',
          scroll: true,
          attachToBody: true
        }, {
          type: 'element',
          selector: 'header .branding a',
          heading: 'Home',
          text: 'You can go to home page by clicking on logo',
          placement: 'right',
          scroll: true,
          attachToBody: true
        }, {
          type: 'locationwindow._change',
          path: '/questions/all'
        }]
      })

      $window.onclick = function () {
        if ($scope.notificationsOpened) {
          $scope.closeNotifications()
          $scope.$apply()
        }
      }

      if ($routeParams.searchTerms) {
        $scope.searchTerms = $routeParams.searchTerms
      }

      function getUpdates () {
        if (!currentUser.isAuthenticated) {
          return
        }

        profilesDataService.getCurrentUserNotifications()
          .then(function (notifications) {
            $scope.notifications = notifications
          })

        profilesDataService.getCurrentUserProfile()
          .then(function (user) {
            $scope.user = user
          })
      }

      getUpdates()

      $interval(getUpdates, 30000)

      $scope.$watch('currentUser.isAuthenticated', getUpdates)

      $rootScope.$on('$routeChangeSuccess', function () {
        $scope.searchTerms = $routeParams.searchTerms
      })

      $scope.$watch('currentUser.isAuthenticated', function () {
        if ($scope.currentUser.isAuthenticated && !$localStorage.visitedTour) {
          showTour()
        }
      })
    })
