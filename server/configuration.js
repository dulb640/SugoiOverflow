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

nconf
  .file({ file: path.join(__dirname, '../config.json') })
  .file({ file: path.join(__dirname, '../config.yaml'), format: yaml })
  .use('memory')
  .defaults({
    'if nothing else': 'use this value'
  });

module.exports = function(key){
  return nconf.get(key);
};
