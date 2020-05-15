'use strict';

anxeb.vue.include.filter('number', function (value, params) {
	if (value == null) {
		value = 0;
	}

	if (typeof params === 'boolean') {
		if (params === true) {
			params = 2;
		} else {
			params = 0;
		}
	}

	value = parseFloat(value).toFixed(params || 0);
	value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
	return value;
});