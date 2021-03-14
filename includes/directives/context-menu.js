'use strict';

anxeb.vue.include.directive('context-menu', {
	bind     : function (el, directive) {
		if (directive.value != null && directive.value.disabled !== true) {
			el.oncontextmenu = async function (e) {
				try {
					let cmenu = await anxeb.vue.helpers.root.$fetch('context-menu');
					if (cmenu) {
						let $actions = directive.value instanceof Array ? directive.value : directive.value.actions;
						let $options = directive.value instanceof Array ? null : directive.value.options;

						cmenu.pop({
							event   : e,
							actions : $actions,
							options : $options
						});
					}
				} catch (err) { }
				e.preventDefault();
			}
		}
	},
	update   : function (el, directive) {
		if (directive.value != null && directive.value.disabled !== true) {
			el.oncontextmenu = async function (e) {
				try {
					let cmenu = await anxeb.vue.helpers.root.$fetch('context-menu');
					if (cmenu) {
						let $actions = directive.value instanceof Array ? directive.value : directive.value.actions;
						let $options = directive.value instanceof Array ? null : directive.value.options;

						cmenu.pop({
							event   : e,
							actions : $actions,
							options : $options
						});
					}
				} catch (err) { }
				e.preventDefault();
			}
		}
	},
	inserted : function (el) {

	}
});