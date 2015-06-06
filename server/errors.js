'use strict';

function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = (message || '');
}
NotFoundError.prototype = Error.prototype;

function GenericError(message, inner) {
  this.name = 'GenericError';
  this.message = (message || '');
  this.inner = inner;
}
GenericError.prototype = Error.prototype;

module.exports = {
  NotFoundError: NotFoundError,
  GenericError: GenericError
};
