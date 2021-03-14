'use strict';

anxeb.vue.include.component('toggle-button', function (helpers) {
	return {
		props    : ['value', 'label', 'icon', 'width', 'height', 'size'],
		template : '/components/toggle-button.vue',
		created  : function () {
			this.state = this.value;
		},
		updated  : function () {
			this.state = this.value;
		},
		methods  : {
			toggle : function () {
				this.state = !this.state;
				this.$emit('input', this.state);
			}
		},
		watch    : {
			value : function (value) {
				this.state = this.value;
			}
		},
		data     : function () {
			return {
				state : null
			}
		},
	}
});