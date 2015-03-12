var passport = require('passport');
module.exports = function(){
	'use strict';

	return passport.authenticate.call(this, 'jwt', { session: false});
};