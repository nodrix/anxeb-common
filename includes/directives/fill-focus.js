'use strict';

anxeb.vue.include.directive('fill-focus', {
	bind     : function (el, directive) {
		el.addEventListener('click', () => {
			if (window.getSelection) {
				if (window.getSelection().toString().length === 0) {
					if (directive.value === undefined || directive.value === true) {
						el.focus();
						setTimeout(function () {
							el.select();
						}, 0);
					}
				}
			}
		});
	},
	inserted : function (el) {

	}
});