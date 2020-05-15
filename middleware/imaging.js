'use strict';

const anxeb = require('anxeb-node');

module.exports = {
	processFileRequest : function (context, resource) {
		context.service.storage.fetch(resource, { stats : true }).then(function (result) {

			if (context.query.raw === undefined) {
				let options = null;

				if (context.query.width) {
					options = options || {};
					options.resize = { width : parseInt(context.query.width) };
				}

				if (context.query.height) {
					options = options || {};
					options.resize = { height : parseInt(context.query.height) };
				}

				if (context.query.sharpen) {
					options = options || {};
					options.sharpen = false;
				}

				if (context.query.png) {
					options = options || {};
					options.png = {
						compressionLevel : context.query.compressionLevel != null ? parseInt(context.query.compressionLevel) : 9,
						quality          : parseInt(context.query.png)
					};
				}

				if (context.query.webp) {
					options = options || {};
					options.webp = {
						alphaQuality : context.query.alphaQuality != null ? parseInt(context.query.alphaQuality) : 100,
						quality      : parseInt(context.query.webp)
					};
				}

				if (context.query.jpg) {
					options = options || {};
					options.jpg = {
						progressive : context.query.progressive == null,
						quality     : parseInt(context.query.jpg)
					};
				}

				context.image(result.data, options);
			} else {
				context.send({
					content : result.data
				});
			}

		}).catch(function (err) {
			context.log.exception.file_not_found.args(resource).throw({ next : context.next, silent : true });
		});
	},
	getStorageRoutes   : function (names, routes) {
		let _self = this;
		routes = routes || {};

		for (let i = 0; i < names.length; i++) {
			let name = names[i];

			routes[name] = {
				url     : '/' + name + '/:id/:file/:extension',
				methods : {
					get : function (context) {
						let id = context.params.id;
						let file = context.params.file;
						let extension = context.params.extension;
						let resource = anxeb.utils.path.join(name, id, file + '.' + extension);

						_self.processFileRequest(context, resource);
					}
				}
			};
		}

		return routes;
	}
};