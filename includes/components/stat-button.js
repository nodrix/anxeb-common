'use strict';

anxeb.vue.include.component('stat-button', function (helpers) {
	return {
		props    : ['prefix', 'label', 'value', 'icon', 'color', 'value'],
		template : '/components/stat-button.vue',
		mounted  : function () {

		},
		methods  : {
			action : function () {
				this.$emit('click');
			}
		},
		data     : function () {
			return {}
		},
		computed : {}
	}
});