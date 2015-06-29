'use strict'
var rewriteIis = function (req, res, next) {
  var originalUrl = req.headers['x-original-url']
  if (originalUrl) {
    if (originalUrl !== '') {
      req.url = req.url.replace(originalUrl, '') || '/'
    }
  }
  return next()
}

module.exports = rewriteIis
