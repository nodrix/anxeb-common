'use strict';

anxeb.vue.include.directive('disabled', {
	bind     : function (el, directive) {
		if (directive.value === true) {
			$(el).addClass('app-disabled');
		} else if (directive.value === false) {
			$(el).removeClass('app-disabled');
		}
	},
	update  : function (el, directive) {
		if (directive.value === true) {
			$(el).addClass('app-disabled');
		} else if (directive.value === false) {
			$(el).removeClass('app-disabled');
		}
	},
	inserted : function (el) {

	}
});