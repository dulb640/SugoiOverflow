'use strict';

var session         = require('koa-generic-session');
var koa             = require('koa');
var passport        = require('koa-passport');
var WindowsStrategy = require('passport-windowsauth');

var logger          = require('./logger');

var config          = require('./configuration');
var send = require('koa-send');
var serve = require('koa-static');

var mongoose   = require('mongoose-q')(require('mongoose'));
var domain     = require('./domain');
var routes     = require('./routes');
var bodyParser = require('koa-body-parser');

var app = koa();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var ldapConfig = config('ldap');
if(ldapConfig && config('active-directory')){
  var authCallback = function authCallback(profile, done){
    done(null, profile);
  };
  var windowsStrategy = new WindowsStrategy({ ldap: ldapConfig }, authCallback);
  passport.use(windowsStrategy);
}

if(config('iis')){
  var rewriteIis = require('./iisIntegration');
  app.use(rewriteIis);
}

app.use(bodyParser());
var rewrite = require('koa-rewrite');



app.keys = ['your-session-secret'];
app.use(session());
app.use(passport.initialize());
app.use(passport.session());

if(config('windows-auth')){
  app.use(function *(next) {
    yield* passport.authenticate('WindowsAuthentication')
      .call(this, next);
  });
}

/*app.use(function *(){
  yield send(this, this.path, { root: __dirname + '../build' });
});*/

app.use('/', serve('../build'));

/*app.use(function *(){
  this.body = this.req.user.emails[0];
});*/
//app.use(routes);

app.on('error', function(err){
  logger.error('server error', err);
});

app.listen(config('PORT') || config('port'));
