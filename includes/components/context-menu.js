'use strict';

anxeb.vue.include.component('context-menu', function (helpers) {
	return {
		vendors  : ['/styles/context-menu.css'],
		props    : ['offset'],
		template : '/components/context-menu.vue',
		mounted  : function () {
			let _self = this;
			$(document).bind('mousedown.' + _self.name, function (e) {
				let box = $(_self.$refs.box);
				let button = $(_self.$refs.btn);
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					return;
				}

				if (_self.context && _self.context.event.target !== e.target) {
					_self.context = null;
				}
			});
		},
		methods  : {
			pop     : function (context) {
				let _self = this;
				_self.context = context;
				_self.$forceUpdate();
			},
			execute : function (item) {
				if (item.action) {
					item.action();
				}
				this.context = null;
			}
		},
		computed : {
			positionStyle : function () {
				if (this.context == null) {
					return null;
				}
				let $offset = this.offset || { x : 0, y : 0 };
				let $position = {
					x : this.context.event.clientX,
					y : this.context.event.clientY
				};
				return {
					top  : `${$position.y + ($offset.y || 0)}px`,
					left : `${$position.x - ($offset.x || 0)}px`
				};
			}
		},
		data     : function () {
			return {
				context : null
			}
		}
	}
});