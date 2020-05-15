'use strict';
let anxeb = require('anxeb-node');

module.exports = {
	url       : '/references/:type',
	view      : 'references',
	container : 'private',
	roles     : ['administrator', 'tenant'],
	type      : anxeb.Route.types.view,
	access    : anxeb.Route.access.private,
	methods   : {
		get : function (context) {
			context.render();
		}
	},
	childs    : {
		detail : {
			url     : '/:referenceId/detail',
			methods : {
				get : function (context) {
					context.render();
				}
			},
		},
		items  : {
			url     : '/:referenceId/items',
			methods : {
				get : function (context) {
					context.render();
				}
			}
		}
	}
};