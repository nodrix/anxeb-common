'use strict';
let anxeb = require('anxeb-node');

module.exports = {
	container : 'light',
	type      : anxeb.Route.types.exception,
	access    : anxeb.Route.access.public,
	methods   : {
		get : function (context) {
			context.render();
		}
	}
};