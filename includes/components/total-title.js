'use strict';

anxeb.vue.include.component('total-title', function (helpers) {
	return {
		props    : ['label', 'prefix', 'value', 'decimals', 'layout', 'label-color', 'value-color', 'bg-color', 'action', 'argument', 'comma', 'width', 'prefix-icon', 'action-options'],
		template : '/components/total-title.vue',
		mounted  : function () {
			let _self = this;
			$(document).bind('mouseup.' + _self.name, function (e) {
				let box = $(_self.$refs.box);
				let button = $(_self.$refs.btn);
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.optionsVisible = false;
				}
			});
		},
		methods  : {
			runAction          : function () {
				if (this.action) {
					this.action(this.argument);
				}
			},
			toggle             : function () {
				this.optionsVisible = !this.optionsVisible;
			},
			selectActionOption : function (item) {
				this.optionsVisible = false;

				if (this.action) {
					this.action(this.argument, item.key);
				}
			}
		},
		data     : function () {
			let _self = this;
			return {
				optionsVisible : false
			}
		},
		computed : {
			display : function () {
				return isNaN(this.value) || this.value == null ? 0 : this.value;
			},
			options : function () {
				let result = [];
				if (this.actionOptions != null) {
					for (let key in this.actionOptions) {
						result.push({
							key   : key,
							label : this.actionOptions[key]
						});
					}
				}
				return result;
			}
		}
	}
});