'use strict';

anxeb.vue.include.component('actions', function (helpers) {
	return {
		props    : ['title', 'icon', 'layout', 'enabled', 'active'],
		template : '/components/actions.vue',
		mounted  : function () {
			let _self = this;
			$(document).bind('mouseup.' + _self.name, function (e) {
				let box = $(_self.$refs.box);
				let button = $(_self.$refs.btn);
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.visible = false;
				}
			});
		},
		methods  : {
			contextmenu : function (container, e) {
				this.context = { target : e.target, container : container };
			},
			toggle      : function (visibility) {
				let $visibility;
				if (this.enabled !== false) {
					this.$emit('click');
					if (visibility != null) {
						$visibility = visibility;
					} else {
						$visibility = !this.visible;
					}
				}
				this.visible = $visibility;
			}
		},
		computed : {},
		data     : function () {
			return {
				visible : false
			}
		}
	}
});