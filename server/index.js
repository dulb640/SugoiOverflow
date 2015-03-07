'use strict';

var express =           require('express');
var bodyParser =        require('body-parser');
var passport =          require('passport');
var WindowsStrategy =   require('passport-windowsauth');
var path =              require('path');
var morgan =            require('morgan');
var mongoose =          require('mongoose-q')(require('mongoose'));
var cookieParser =      require('cookie-parser');
var multer =            require('multer');
var logger =            require('./logger');
var config =            require('./configuration');
var domain =            require('./domain');
var routes =            require('./routes');

var mongoConnectionString = config('mongo');
mongoose.connect(mongoConnectionString);

var app = express();

/*passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});*/

/*var ldapConfig = config('ldap');
if(ldapConfig && config('active-directory')){
  var authCallback = function authCallback(profile, done){
    done(null, profile);
    domain.User.findOneQ({adId: profile.id})
      .then(function(user){
        if(user){
          done(null, user);
        }
        else{
          var newUser = {
            adId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName
          };

          new domain.User(newUser).saveQ()
            .then(function(){
              done(null, newUser);
            })
            .catch(function(error){
              logger.error('Error saving new user to database', error);
            });
        }
      })
      .catch(function(error){
        logger.error('Error getting user from database', error);
      });
  };
  var windowsStrategy = new WindowsStrategy({ ldap: ldapConfig }, authCallback);
  passport.use(windowsStrategy);
}*/

if(config('iis')){
  var rewriteIis = require('./iisIntegration');
  app.use(rewriteIis);
}

var morganLogger = morgan('short');
app.use(morganLogger);
app.use(bodyParser());
app.use(cookieParser());

app.set('trust proxy', 1);
app.use(passport.initialize());

app.use(function(req, res, next){
  req.user = domain.User.findOneQ({adId:'123'})
    .then(function(user){
      req.user = user;
      next();
    });
});

if(config('windows-auth')){
 // app.use(passport.authenticate('WindowsAuthentication', { session: false }));
}

app.use(function(req, res, next){
  res.cookie('user-id', req.user.id);
  res.cookie('user-name', req.user.name);
  next();
});

app.use('/api', routes);
app.use('/content', express.static(path.join(__dirname, '../content')));
app.use(express.static(path.join(__dirname, '../build')));


//app.use('/', routes);
app.listen(config('PORT') || config('port'));
