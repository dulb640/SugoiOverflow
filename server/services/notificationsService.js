'use strict';

var config = require('../configuration');
var logger = require('../logger');

var notificationsConfig = config('notifications');
var nodemailer = require('nodemailer');

function send(subject, text, user) {
  if(notificationsConfig.smtp) {
    var smtpTransport = require('nodemailer-smtp-transport');
    var smtpOptions = {
        host: notificationsConfig.smtp.host,
        port: notificationsConfig.smtp.port || 25,
        auth: {
            user: 'username',
            pass: 'password'
        }
    };

    if(notificationsConfig.smtp.auth) {
      smtpOptions.auth = {
        user: notificationsConfig.smtp.auth.username,
        pass: notificationsConfig.smtp.auth.password
      };
    }

    var transporter = nodemailer.createTransport(smtpTransport(smtpOptions));
    transporter.sendMail({
      from: notificationsConfig.smtp.from || 'sugoioverflow',
      to: user.email,
      subject: subject,
      text: text
    });

    logger.info('Sent email to %s', user.email);
  }
}

module.exports = send;
