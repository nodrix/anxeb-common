'use strict';
let eventTypes = require('anxeb-node').Event.types;

module.exports = {
	data_validation_exception : {
		message : 'Uno o varios campos son requeridos en la solicitud',
		code    : 8005,
		type    : 'data_exception'
	}
};