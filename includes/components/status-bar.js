'use strict';

anxeb.vue.include.component('status-bar', function (helpers) {
	return {
		props    : ['options', 'state-text'],
		template : '/components/status-bar.vue',
		methods  : {
			setHint : function (item) {
				let _self = this;
				setTimeout(function () {
					_self.hint = '';
				}, 2000);
				_self.hint = item.hint;
			}
		},
		data     : function () {
			return {
				hint : ''
			}
		},
		computed : {
			finalHint : function () {
				return this.stateText || (this.hint && this.hint.length ? this.hint : null) || '&nbsp;';
			}
		}
	}
});