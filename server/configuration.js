'use strict';

var nconf = require('nconf');
var path  = require('path');

nconf.argv()
  .env();

var environment = nconf.get('NODE_ENV');
if(environment){
  nconf
  .file({ file: path.join(__dirname, '../config.' + environment + '.json') });
}

nconf
  .file({ file: path.join(__dirname, '../config.json') })
  .use('memory')
  .defaults({
    'if nothing else': 'use this value'
  });

module.exports = function(key){
  return nconf.get(key);
};
