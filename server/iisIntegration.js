'use strict';

var rewriteIis = function *(next) {
  var originalUrl = this.request.header['x-original-url'];
  if (originalUrl) {
    if (originalUrl !== '') {
      this.request.url = this.request.url.replace(originalUrl, '') || '/';
    }
  }
  yield next;
};

module.exports = rewriteIis;