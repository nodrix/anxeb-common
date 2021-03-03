'use strict';

anxeb.vue.include.directive('fill-focus', {
	bind     : function (el, directive) {
		el.addEventListener('mouseup', () => {
			if (directive.value === undefined || directive.value === true) {
				let alreadySelected = el.getAttribute('already-selected') === 'true';
				if (!alreadySelected) {
					el.focus();
					setTimeout(function () {
						el.select();
						el.setAttribute('already-selected', true);
					}, 0);
				}
			}
		});

		el.addEventListener('blur', () => {
			el.setAttribute('already-selected', false);
		});
	},
	inserted : function (el) {

	}
});