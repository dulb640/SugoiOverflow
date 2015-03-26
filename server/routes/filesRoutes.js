'use strict';

var domain      = require('../domain');
var logger      = require('../logger');

var express = require('express');
var router  = express.Router();
var Busboy = require('busboy');
var Grid =   require('gridfs-stream');
var fs =   require('fs');
var path =   require('path');
var config = require('../configuration');
var passport = require('passport');
var gm = require('gm');

var mongoose = require('mongoose-q')(require('mongoose'));
var Q = require('q');

var gfs = new Grid(mongoose.connection.db, mongoose.mongo);

router.post('/avatar', passport.authenticate('jwt', { session: false}), function(req, res, next){
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file/*, filename, encoding, mimetype*/) {
    var writestream = gfs.createWriteStream({
      root:'avatars',
      filename: req.user.id,
    });

    var avatarsConfig = config('avatars');

    gm(file)
      .resize(avatarsConfig.size.x, avatarsConfig.size.y, '^')
      .gravity('Center')
      .crop(avatarsConfig.size.x, avatarsConfig.size.y)
      .compress(avatarsConfig.format)
      .quality(avatarsConfig.quality)
      .stream()
      .pipe(writestream);
  });

  busboy.on('finish', function() {
    res
      .status(200)
      .send();
  });

  busboy.on('error', function(error) {
    logger.error('Error uploading avatar', error);
    return next(error);
  });

  return req.pipe(busboy);
});

router.get('/avatar/:username', function(req, res, next){
  domain.User.findOneQ({username: req.params.username})
    .then(function(user){
      var opts = {
        filename: user.id,
        root:'avatars'
      };
      Q.ninvoke(gfs, 'exist', opts)
        .then(function(exists){
          if(exists){
            return gfs.createReadStream(opts);
          } else{
            var filename = path.resolve(__dirname, '../../content/no-avatar.jpg');
            return fs.createReadStream(filename);
          }
        })
        .then(function(stream){
          stream.on('open', function () {
            stream.pipe(res);
          });
        })
        .catch(function(error){
          logger.error('Error getting avatar', error);
          return next(error);
        });
    });

});

module.exports = router;
