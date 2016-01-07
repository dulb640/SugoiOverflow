/* global angular, _*/
angular.module('sugoiOverflow.auth')
  .factory('currentUser',
    function ($localStorage) {
      'use strict'

      var service = {
        clear: function () {
          service.email = ''
          service.displayName = ''
          service.username = ''
          service.roles = []
        }
      }

      Object.defineProperty(service, 'isAuthenticated', {
        get: function () { return !!$localStorage.jwt }
      })

      Object.defineProperty(service, 'isPopulated', {
        get: function () { return service.email || service.username || service.displayName || service.roles }
      })

      Object.defineProperty(service, 'email', {
        get: function () { return $localStorage.email },
        set: function (newValue) { $localStorage.email = newValue }
      })

      Object.defineProperty(service, 'userId', {
        get: function () { return $localStorage.userId },
        set: function (newValue) { $localStorage.userId = newValue }
      })

      Object.defineProperty(service, 'username', {
        get: function () { return $localStorage.username },
        set: function (newValue) { $localStorage.username = newValue }
      })

      Object.defineProperty(service, 'displayName', {
        get: function () { return $localStorage.userDisplayName },
        set: function (newValue) { $localStorage.userDisplayName = newValue }
      })

      Object.defineProperty(service, 'roles', {
        get: function () { return $localStorage.roles },
        set: function (newValue) { $localStorage.roles = newValue }
      })

      Object.defineProperty(service, 'canModerate', {
        get: function () {
          return _.intersection($localStorage.roles, ['admin', 'moderator']).length > 0
        }
      })

      if (!service.isPopulated) {
        service.clear()
      }

      return service
    })
