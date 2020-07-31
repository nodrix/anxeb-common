'use strict';

anxeb.vue.include.component('field-file', function (helpers) {
	return {
		template     : '/controls/field-file.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'field-name', 'size', 'focus', 'required'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
		},
		data         : function () {
			return {
				name : null,
				file : null
			}
		},
		methods      : {
			reset  : function () {
				let _self = this;
				_self.file = null;
				_self.$emit('input', null);
			},
			browse : function () {
				let _self = this;

				helpers.browse.file().then(function (file) {
					_self.file = file;
					_self.$emit('input', file);
				}).catch(function (err) {
					_self.$parent.log('Error cargando archivo').exception();
				});
			},
			clear  : function () {
				this.file = null;
				this.$emit('input', null);
			},
		},
		computed     : {
			sizeCaption : function () {
				let _self = this;
				if (_self.file) {
					return helpers.tools.format.bytes(_self.file.size);
				}
				return null;
			},
			post_value  : function () {
				let _self = this;
				if (_self.file) {
					return _self.file.name;
				}
				return null;
			},
			listener    : function () {
				let _self = this;
				return Object.assign({}, this.$listeners, {
						input : function (event) {
							_self.$emit('input', event.target.value);
						}
					}
				)
			}
		}
	};
});