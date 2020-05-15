'use strict';

let fields = require('anxeb-mongoose').Fields;

module.exports = {
	Schema : function (required) {
		return {
			_id    : false,
			date   : fields.date(required === true),
			type   : fields.string(required === true),
			state  : fields.string(required === true),
			notes  : fields.string(required === true),
			user   : fields.reference('User'),
			meta   : fields.mixed()
		}
	}
};