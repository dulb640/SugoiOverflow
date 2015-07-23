/* global angular*/
angular.module('sugoiOverflow.shared')
  .factory('promisedHttp',
  function ($http, $q) {
    'use strict'

    return function convert$httpToPromise (method, url, data) {
      return $q(function (resolve, reject) {
        $http['method'](url, data)
          .success(function (responseData) {
            resolve(responseData)
          })
          .error(function (error) {
            reject(error)
          })
      })
    }
  })
