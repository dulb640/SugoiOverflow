'use strict';

module.exports = function*(next) {
  this.assert(this.isAuthenticated(), 401, 'Not Authenticated');
  yield next;
};