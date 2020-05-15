'use strict';

anxeb.vue.include.filter('upper', function (value) {
	if (value) {
		return value.toUpperCase();
	}
});