'use strict';

function NotFoundError(message) {
  this.name = 'NotFoundError';
  this.message = (message || '');
  this.stack = new Error().stack;
}
NotFoundError.prototype = Error.prototype;

function GenericError(message, inner) {
  this.name = 'GenericError';
  this.message = (message || '');
  this.inner = inner;
  this.stack = new Error().stack;
}
GenericError.prototype = Error.prototype;

function InvalidOperationError(message) {
  this.name = 'InvalidOperationError';
  this.message = (message || '');
  this.stack = new Error().stack;
}
InvalidOperationError.prototype = Error.prototype;

function ArgumentError(message, argumentName) {
  this.name = 'ArgumentError';
  this.argumentName = argumentName;
  this.message = (message || '');
  this.stack = new Error().stack;
}
ArgumentError.prototype = Error.prototype;

module.exports = {
  NotFoundError: NotFoundError,
  GenericError: GenericError,
  ArgumentError: ArgumentError,
  InvalidOperationError: InvalidOperationError
};
