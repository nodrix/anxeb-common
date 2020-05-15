'use strict';

const fields = require('anxeb-mongoose').Fields;

module.exports = {
	collection : 'Sequences',
	schema     : {
		type   : fields.enum({ required : true, index : true }, ['sale', 'purchase', 'payment', 'sheet', 'counting', 'shift', 'transaction']),
		name   : fields.string({ required : true, index : true }),
		entity : fields.reference(),
		value  : fields.number({ required : true, index : true })
	},
	methods    : {
		toClient : function (childs) {
			return {
				id     : this._id,
				type   : this.type,
				name   : this.name,
				entity : this.entity,
				value  : this.value,
			};
		}
	}
};