'use strict';

anxeb.vue.include.filter('decimals', function (value, params) {
	let result = '';
	let decimalCount = params != null ? parseInt(params) : 2;
	if (value == null) {
		value = 0;
	}

	value = parseFloat(value).toFixed(decimalCount);

	let pind = value.indexOf('.');
	if (pind > -1) {
		result = value.substr(pind + 1);
	}


	if (result.length < decimalCount) {
		for (let i = 0; i < (decimalCount - result.length); i++) {
			result = result + '0';
		}
	}
	return result;
});