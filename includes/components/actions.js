'use strict';

anxeb.vue.include.component('actions', function (helpers) {
	return {
		props    : ['title', 'icon', 'layout', 'enabled', 'active', 'offset'],
		template : '/components/actions.vue',
		mounted  : function () {
			let _self = this;
			$(document).bind('mouseup.' + _self.name, function (e) {

				if (e.button === 2 && _self.contextElement === e.target) {
					_self.toggle(true, {
						x : e.originalEvent.clientX,
						y : e.originalEvent.offsetY
					});
					return;
				}

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
			contextmenu : function (e) {
				this.contextElement = e.target;
			},
			toggle      : function (visibility, position) {
				let $visibility;
				if (this.enabled !== false) {
					this.$emit('click');
					if (visibility != null) {
						$visibility = visibility;
					} else {
						$visibility = !this.visible;
					}
				}

				if ($visibility && position) {
					this.position = position;
				} else {
					this.position = null;
				}
				this.visible = $visibility;
			}
		},
		computed : {
			positionStyle : function () {
				if (this.position) {
					return {
						top  : `${this.position.y + (this.offset.y || 0)}px`,
						left : `${this.position.x - (this.offset.x || 0)}px`
					}
				} else {
					return null;
				}
			}
		},
		data     : function () {
			return {
				contextElement : null,
				visible        : false,
				position       : null
			}
		}
	}
});