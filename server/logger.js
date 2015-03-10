'use strict';

var winston = require('winston');
var path = require('path');
var fs = require('fs');
var config = require('./configuration');

var logFolder = config('log-folder');
var fullPath = path.join(__dirname, '/../', logFolder);

fs.exists(fullPath, function (exists) {
  if(!exists){
    fs.mkdir(fullPath);
  }
});


var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ json: false, timestamp: true, prettyPrint: true, colorize: true }),
    new winston.transports.File({ filename: path.join(fullPath, 'debug.log'), json: false })
  ],
/*  exceptionHandlers: [
    new winston.transports.Console({ json: false, timestamp: true, colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: path.join(fullPath, 'exceptions.log'), json: false })
  ],*/
  exitOnError: false
});

module.exports = logger;
