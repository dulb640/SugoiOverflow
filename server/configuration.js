'use strict';

var nconf = require('nconf');

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
    protocol: 'http',
    domain: 'localhost',
    path: '',
    port: 3000,
    branding:{
      title: 'SugoiOverflow'
    },
    'log-folder': 'logs',
    iis: false,
    avatars:{
      size:{
        x:320,
        y:320
      },
      format: 'jpeg',
      quality: 90
    },
    auth:{
      'active-directory': false,
      local: true,
      pepper: defaultPepper,
      jwt:{
        secretOrKey: '',
        issuer: 'sugoioverflow',
        audience: 'people.sugoioverflow'
      }
    },
    notifications: {
      smtp: false
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
