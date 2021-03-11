'use strict';

anxeb.vue.include.component('box-button', function (helpers) {
	return {
		props    : ['label', 'icon', 'alert', 'width', 'path', 'type', 'description', 'caption', 'notifications', 'show-text', 'finally'],
		template : '/components/box-button.vue',
		mounted  : function () {
			this.updateState();
		},
		methods  : {
			navigate    : function () {
				if (this.$parent.$router.currentRoute.path.endsWith(this.path)) {
					return;
				}
				if (this.finally != null) {
					this.finally();
				}
				this.$parent.$root.navigate(this.path);
			},
			updateState : function (routePath) {
				routePath = routePath || this.$router.currentRoute.path;
				let buttonPath = this.path;
				this.active = routePath.toLowerCase().indexOf(buttonPath.toLowerCase()) > -1 || buttonPath.toLowerCase().indexOf(routePath.toLowerCase()) > -1;
			}
		},
		watch    : {
			$route(to, from) {
				this.updateState(to.path);
			}
		},
		data     : function () {
			return {
				active : false
			}
		},
	}
});