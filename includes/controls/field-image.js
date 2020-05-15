'use strict';

anxeb.vue.include.component('field-image', function (helpers) {

	return {
		template     : '/controls/field-image.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'url', 'alt-url', 'height', 'width', 'field-name', 'size'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
		},
		data         : function () {
			return {
				name  : null,
				image : null
			}
		},
		methods      : {
			reset  : function () {
				let _self = this;
				_self.image = null;
				_self.$emit('input', null);
			},
			browse : function () {
				let _self = this;

				helpers.browse.image().then(function (image) {
					_self.image = image;
					_self.$emit('input', image.data);
				}).catch(function (err) {
					_self.$parent.log('Error cargando imagen').exception();
				});
			}
		},
		computed     : {
			current_image : function () {
				let _self = this;
				if (_self.image && _self.image.href) {
					return 'url(' + _self.image.href + ')';
				} else {
					if (_self.url) {
						if (_self.altUrl) {
							return 'url(' + _self.url + '?webp=80&t=' + (_self.$root.profile.tick || '') + '), url(' + _self.altUrl + '?t=' + self.$root.profile.tick + ')';
						} else {
							return 'url(' + _self.url + '?webp=80&t=' + (_self.$root.profile.tick || '') + ')';
						}
					} else {
						return null;
					}
				}
			}
		}
	};
});