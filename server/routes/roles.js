var errors = require('../errors')
var _ = require('lodash')

function roles (roles) {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return function rolesMiddleware (req, res, next) {
    if (req.user && req.user.roles && _.intersection(~req.user.roles, roles).length > 0) {
      return next()
    }

    return next(new errors.NotAuthorisedError())
  }
}

module.exports = roles
