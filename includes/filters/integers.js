'use strict';

anxeb.vue.include.filter('integers', function (value, decimals, comma) {
	let decimalCount = decimals != null ? decimals : 2;
	let thousandComma = comma != null ? comma : true;

	if (value == null) {
		value = 0;
	}

	value = parseFloat(value).toFixed(decimalCount);

	let pind = value.indexOf('.');
	if (pind > -1) {
		value = value.substring(0, pind);
	}
	if (thousandComma === true) {
		value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	}
	return value;
});