'use strict';

anxeb.vue.include.component('field-select', function (helpers) {
	return {
		template     : '/controls/field-select.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'focus', 'required', 'id', 'readonly', 'items', 'value-bind', 'key-bind', 'show-first', 'field-name', 'source', 'opaque'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);

			if (_self.source != null) {
				let options = typeof _self.source === 'string' ? { url : _self.source } : _self.source;
				_self.$root.page.busy();
				helpers.api.get(options.url, options.params).then(function (res) {
					_self.$root.page.idle();
					_self.data = res.data;
				}).catch(function () {});
			}
		},
		data         : function () {
			return {
				name : null,
				data : null
			}
		},
		computed     : {
			selectedValue : function () {
				let _self = this;
				for (let key in _self.items) {
					let item = _self.items[key];
					if (_self.value === (item[_self.valueBind || 'key'] || key)) {
						return item[_self.valueBind || 'key'] || item;
					}
				}
				return '';
			},
			list          : function () {
				let _self = this;
				if (_self.data != null) {
					return _self.data;
				} else {
					return _self.items;
				}
			},
			listener      : function () {
				let _self = this;
				return Object.assign({}, this.$listeners, {
						input : function (event) {
							_self.$emit('input', event.target.value)
						}
					}
				)
			}
		}
	};
});