'use strict';

anxeb.vue.include.scope('references/detail', function (helpers, instance) {
	return {
		mounted  : function () {
			let _self = this;
			_self.reference = helpers.tools.data.copy(_self.parent.selected);
		},
		methods  : {},
		computed : {
			parent : function () {
				return this.$parent.$parent;
			}
		},
		data     : function () {
			return {
				reference : null
			};
		}
	}
});