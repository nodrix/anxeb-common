'use strict';

const anxeb = require('anxeb-node');
const sharp = require('sharp');

module.exports = {
	processFileRequest : async function (context, resource, options) {
		try {
			let data;

			if (options && options.isPath === true) {
				data = resource;
			} else {
				let fetchResult = await context.service.storage.fetch(resource, { stats : true });
				data = fetchResult.data;
			}

			if (context.query.raw === undefined) {
				let $png = context.query.png;
				let $jpg = context.query.jpg;
				let $webp = context.query.webp;
				let sharpOptions = null;

				if (context.query.width) {
					sharpOptions = sharpOptions || {};
					sharpOptions.resize = { width : parseInt(context.query.width) };
				}

				if (context.query.height) {
					sharpOptions = sharpOptions || {};
					sharpOptions.resize = { height : parseInt(context.query.height) };
				}

				if (context.query.sharpen) {
					sharpOptions = sharpOptions || {};
					sharpOptions.sharpen = false;
				}

				if (context.query.quality) {
					if (options.extension === 'png') {
						$png = context.query.quality;
					} else if (options.extension === 'png') {
						$jpg = context.query.quality;
					} else {
						$webp = context.query.quality;
					}
				}

				if ($png) {
					sharpOptions = sharpOptions || {};
					sharpOptions.png = {
						compressionLevel : context.query.compressionLevel != null ? parseInt(context.query.compressionLevel) : 9,
						quality          : parseInt($png)
					};
				}

				if ($webp) {
					sharpOptions = sharpOptions || {};
					sharpOptions.webp = {
						alphaQuality : context.query.alphaQuality != null ? parseInt(context.query.alphaQuality) : 100,
						quality      : parseInt($webp)
					};
				}

				if ($jpg) {
					sharpOptions = sharpOptions || {};
					sharpOptions.jpg = {
						progressive : context.query.progressive == null,
						quality     : parseInt($jpg)
					};
				}

				imageResponse(context, data, sharpOptions);
			} else {
				context.send({
					content : data
				});
			}
		} catch (err) {
			context.log.exception.file_not_found.args(resource).throw({ next : context.next, silent : true });
		}
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

const imageResponse = function (context, data, options) {
	let img = data;
	let ext = 'png';

	if (typeof data === 'string') {
		if (data.startsWith('data:image/jpeg;base64')) {
			ext = 'jpg';
			data = data.replace(/^data:image\/jpeg;base64,/, '');
			img = Buffer.from(data, 'base64');
			context.res.type('jpeg');
		} else if (data.startsWith('data:image/png;base64')) {
			data = data.replace(/^data:image\/png;base64,/, '');
			img = Buffer.from(data, 'base64');
			context.res.type('png');
		} else {
			options = options || {};
		}
	}

	if (options) {
		let imageSharp = sharp(img);

		for (let action in options) {
			let pars = options[action];
			if (imageSharp[action] != null) {
				if (pars === false) {
					imageSharp = imageSharp[action]();
				} else {
					imageSharp = imageSharp[action](pars);
				}
			}
		}

		imageSharp.toBuffer().then(function (result) {
			if (context.query.attachment != null) {
				let fileName = `${context.query.attachment}.${ext}`;
				context.res.set('Content-disposition', 'attachment; filename=' + fileName);
			}

			context.res.end(result);
		}).catch(async function (err) {
			if (typeof data === 'string' && (options.retry == null || options.retry < 1)) {
				let fetchResult = anxeb.utils.file.read(data);
				data = fetchResult;
				options = options || {};
				options.retry = 1;
				delete options.isPath;
				imageResponse(context, data, options);
			} else {
				context.service.log.exception.invalid_image_data.args(err).throw(context);
			}
		});
	} else {
		context.res.end(img);
	}
};