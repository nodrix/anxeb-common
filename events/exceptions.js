'use strict';
let eventTypes = require('anxeb-node').Event.types;

module.exports = {
	invalid_credentials         : {
		message : 'Correo o contraseña incorrecta',
		code    : 901,
		type    : eventTypes.user_exception
	},
	invalid_email               : {
		message : 'Correo inválido',
		code    : 902,
		type    : eventTypes.user_exception
	},
	invalid_password            : {
		message : 'Contraseña Inválida',
		code    : 903,
		type    : eventTypes.user_exception
	},
	selected_name_unavailable   : {
		message : '[0] seleccionado no está disponible',
		code    : 904,
		type    : eventTypes.user_exception
	},
	user_not_found              : {
		message : 'Usuario no encontrado',
		code    : 905,
		type    : eventTypes.user_exception
	},
	prospect_account_registered : {
		message : 'La cuenta [0] ya está tomada, favor utilizar otro correo',
		code    : 906,
		type    : eventTypes.user_exception
	},
	record_not_found            : {
		message : '[0] indicado no existe o su identificador es incorrecto',
		code    : 907,
		type    : eventTypes.user_exception
	},
	inactive_user               : {
		message : 'Usuario inactivo, favor contactar su administrador',
		code    : 908,
		type    : eventTypes.user_exception
	},
	sequence_generation_error   : {
		message : 'Error incrementando secuencia',
		code    : 910,
		type    : eventTypes.user_exception
	},
	record_repeated             : {
		message : '[0] [1] ya se encuentra previamente registrado',
		code    : 911,
		type    : eventTypes.user_exception
	}
};