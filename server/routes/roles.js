var errors = require('../errors')

function roles (role) {
  return function rolesMiddleware (req, res, next) {
    if (req.user && req.user.roles && ~req.user.roles.indexOf(role)) {
      return next()
    }

    return next(new errors.NotAuthorisedError())
  }
}

module.exports = roles
