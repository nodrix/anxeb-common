'use strict';

anxeb.vue.include.filter('lower', function (value) {
	if (value) {
		return value.toLowerCase();
	}
});