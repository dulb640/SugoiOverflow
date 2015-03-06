'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose-q')(require('mongoose'));
var passport        = require('passport');
var WindowsStrategy = require('passport-windowsauth');

var logger          = require('./logger');
var morgan     = require('morgan');

var config          = require('./configuration');

var mongoose        = require('mongoose-q')(require('mongoose'));
var domain          = require('./domain');
var routes          = require('./routes');


var app = express();

var mongoConnectionString = config('mongo');

mongoose.connect(mongoConnectionString);

var logger = morgan('combined');

/*passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});*/

var ldapConfig = config('ldap');
if(ldapConfig && config('active-directory')){
  var authCallback = function authCallback(profile, done){
    var newUser = {
      adId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    };
    domain.User.findOrCreate(newUser, function (err, user) {
      done(err, user);
    });
  };
  var windowsStrategy = new WindowsStrategy({ ldap: ldapConfig }, authCallback);
  passport.use(windowsStrategy);
}

if(config('iis')){
  var rewriteIis = require('./iisIntegration');
  app.use(rewriteIis);
}

app.use(bodyParser());

//app.keys = ['your-session-secret'];
/*app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));*/
app.set('trust proxy', 1);
app.use(passport.initialize());
//app.use(passport.session());

/*app.get('/', passport.authenticate('WindowsAuthentication'), function (req, res) {
  res.send(req.user.emails[0]);
});*/

if(config('windows-auth')){
  app.use(passport.authenticate('WindowsAuthentication', { session: false }));
}

app.get('/', function (req, res) {
  res.send('asd');
});


app.use(routes);

app.use('/', routes);
app.listen(config('PORT') || config('port'));
