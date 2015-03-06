angular.module('sugoiOverflow.interceptors', []);
/*
.config(function($httpProvider) {
  'use strict';

  $httpProvider.interceptors.push('logoutOn401Interceptor');
  $httpProvider.interceptors.push('errorOn403Interceptor');
  $httpProvider.interceptors.push('errorOn404Interceptor');
  $httpProvider.interceptors.push('errorOn500Interceptor');
})
.factory('logoutOn401Interceptor', function ($rootScope, $q, $window) {
  'use strict';

  return {
    request: function (config) {
      return config || $q.when(config);
    },
    requestError: function(request){
      return $q.reject(request);
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function (response) {
      if (response && response.status === 401) {
        $window.location.replace($window.location.pathname + '/login');
        return $q.reject(response);
      }

      return $q.reject(response);
    }
  };
})
.factory('errorOn403Interceptor', function ($rootScope, $q, $injector) {
  'use strict';

  return {
    request: function (config) {
      return config || $q.when(config);
    },
    requestError: function (request) {
      return $q.reject(request);
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function (response) {
      if (response && response.status === 403) {
        $injector.get('$state').go('root.errors-403');
        return $q.reject(response);
      }

      return $q.reject(response);
    }
  };
})
.factory('errorOn404Interceptor', function ($rootScope, $q, $injector) {
  'use strict';

  return {
    request: function (config) {
      return config || $q.when(config);
    },
    requestError: function (request) {
      return $q.reject(request);
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function (response) {
      if (response && response.status === 404) {
        $injector.get('$state').go('root.errors-404');
        return $q.reject(response);
      }

      return $q.reject(response);
    }
  };
})
.factory('errorOn500Interceptor', function ($rootScope, $q, $injector, $window) {
  'use strict';

  return {
    request: function (config) {
      return config || $q.when(config);
    },
    requestError: function (request) {
      return $q.reject(request);
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function (response) {
      if (response && response.status === 500) {
        if (response.data && (response.data.hasErrors || response.data.hasWarnings)){
          return $q.reject(response);
        }
        if (response.config && response.config.url && response.config.url.indexOf('/errors/server-error') > 0) {
                        //Off chance the error page also dies
                        $window.location.replace($window.location.pathname);
                        return $q.reject(response);
                      }
                      $injector.get('$state').go('root.errors-500');
                      return $q.reject(response);
                    }

                    return $q.reject(response);
                  }
                };
              });
*/
