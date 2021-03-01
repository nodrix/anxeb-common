'use strict';

anxeb.vue.include.component('status-bar', function (helpers) {
	return {
		props    : ['options'],
		template : '/components/status-bar.vue',
		methods  : {
			setHint : function (item) {
				let _self = this;
				setTimeout(function () {
					_self.hint = null;
				}, 2000);
				_self.hint = item.hint;
			}
		},
		data     : function () {
			return {
				hint : null
			}
		}
	}
});