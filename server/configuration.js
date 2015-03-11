'use strict';

var nconf = require('nconf');
var util = require('util');

var path  = require('path');
var yaml = require('nconf-yaml');
nconf.argv()
  .env();

var environment = nconf.get('NODE_ENV');
if(environment){
  nconf
  .file({ file: path.join(__dirname, '../config.' + environment + '.json') })
  .file({ file: path.join(__dirname, '../config.' + environment + '.yaml'), format: yaml });
}

var defaultPepper = 'c6ca435e-8d90-11e4-b116-123b93f75cba';

nconf
  .file({ file: path.join(__dirname, '../config.json') })
  .file({ file: path.join(__dirname, '../config.yaml'), format: yaml })
  .use('memory')
  .defaults({
    domain: 'localhost',
    path: '',
    port: 3000,
    'log-folder': 'logs',
    iis: false,
    auth:{
      'active-directory': false,
      local: true,
      pepper: defaultPepper,
      jwt:{
        secretOrKey: '',
        issuer: 'sugoioverflow',
        audience: 'people.sugoioverflow'
      }
    }
  });

var configuredPepper = nconf.get('auth:pepper');
if(configuredPepper === defaultPepper){
  var chalk = require('chalk');
  console.warn(chalk.yellow.underline('Security warning: you are using default pepper'));
}

module.exports = function(key){
  return nconf.get(key);
};
