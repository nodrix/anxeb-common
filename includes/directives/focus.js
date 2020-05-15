'use strict';

anxeb.vue.include.directive('focus', {
	bind     : function (el, directive) {
		if (directive.value === undefined || directive.value === true) {

			el.focus();
			setTimeout(function () {
				el.select();
			}, 0);
		}
	},
	inserted : function (el) {

	}
});