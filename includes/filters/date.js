'use strict';

anxeb.vue.include.filter('date', function (value, params) {
	if (value) {
		let date = null;

		if (typeof value === 'number') {
			date = moment.unix(value);
		} else if (typeof value === 'string') {
			date = moment(String(value));
		} else {
			date = value;
		}

		if (params === 'short') {
			return date.format('D [de] MMMM');
		} else if (params === 'full') {
			return date.format('D [de] MMMM YYYY');
		} else if (params === 'timed') {
			return date.format('DD/MM/YYYY h:mm:A');
		} else if (params === 'time') {
			return date.format('h:mm A');
		} else if (params === 'full_time') {
			return date.format('h:mm:ss A');
		} else if (params === 'extended') {
			return date.format('dddd D [de] MMMM [del] YYYY');
		} else if (params === 'extended_wt') {
			return date.format('dddd D [de] MMMM [del] YYYY h:mm a');
		} else {
			return date.format('D/M/YYYY');
		}
	}
});