'use strict';

anxeb.vue.include.directive('context-menu', function (helpers) {

	let getContextHandler = function (el, params) {
		return async function (e) {
			try {
				let cmenu = await anxeb.vue.helpers.root.$fetch('context-menu');
				if (cmenu) {
					let $actions = params instanceof Array ? params : params.actions;
					let $options = params instanceof Array ? null : params.options;

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

	return {
		bind   : function (el, directive) {
			if (directive.value != null && directive.value.disabled !== true) {
				el.oncontextmenu = getContextHandler(el, directive.value);
			}
		},
		update : function (el, directive) {
			if (directive.value != null && directive.value.disabled !== true) {
				el.oncontextmenu = getContextHandler(el, directive.value);
			}
		}
	};
});