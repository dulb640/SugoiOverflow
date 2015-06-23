'use strict';

var config = require('../configuration');
var logger = require('../logger');

var notificationsConfig = config('notifications');
var Promise = require('bluebird');
var nodemailer = Promise.promisifyAll(require('nodemailer'));
var errors = require('../errors');

function send(subject, text, user) {
  if(notificationsConfig.smtp) {
    var smtpTransport =  Promise.promisifyAll(require('nodemailer-smtp-transport'));
    var smtpOptions = {
        host: notificationsConfig.smtp.host,
        port: notificationsConfig.smtp.port || 25
    };

    if(notificationsConfig.smtp.auth) {
      smtpOptions.auth = {
        user: notificationsConfig.smtp.auth.username,
        pass: notificationsConfig.smtp.auth.password
      };
    }

    var transporter = nodemailer.createTransport(smtpTransport(smtpOptions));
    transporter = Promise.promisifyAll(transporter);
    return transporter.sendMailAsync({
      from: notificationsConfig.smtp.from || 'sugoioverflow',
      to: user.email,
      subject: subject,
      html: text
    })
    .error(function(err){
      logger.error('Error sending email', err);
    })
    .then(function(){
      logger.info('Sent email to %s', user.email);
    });
  }

  return Promise.resolve();
}

module.exports = send;
