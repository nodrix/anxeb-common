'use strict';

anxeb.vue.include.component('field-picker', function (helpers) {
	return {
		template     : '/controls/field-picker.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'options', 'value', 'direction', 'alt-fields'],
		created      : function () {

		},
		mounted      : function () {
			let _self = this;
			_self.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression) : null;

			$(document).bind('mouseup.' + _self.name, function (e) {
				let box = $(_self.$refs.box);
				let button = $(_self.$refs.btn);
				let buttonBox = $(_self.$refs.btnBox);

				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0 || buttonBox.is(e.target) || buttonBox.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});
		},
		destroyed    : function () {
			$(document).unbind('mouseup.' + this.name);
		},
		methods      : {
			clear      : function () {
				let _self = this;
				_self.$emit('input', []);
				_self.reset();
			},
			browse     : function () {
				let _self = this;
				_self.canBrowse = !_self.canBrowse;
			},
			isSelected : function (option) {
				let _self = this;
				return _self.values != null && _self.values.includes(option);
			},
			select     : function (option) {
				let _self = this;
				_self.values = _self.values || [];
				if (!_self.values.includes(option)) {
					_self.values.push(option);
				}
				_self.$emit('input', _self.values);
			},
			reset      : function () {
				this.canBrowse = false;
			},
			remove     : function (option) {
				let _self = this;
				_self.values = _self.values || [];
				_self.values = _self.values.filter(item => item !== option);
				_self.$emit('input', _self.values);
			},
		},
		computed     : {
			isReadOnly  : function () {
				return this.readonly === 'true' || this.readonly === true;
			},
			notReadOnly : function () {
				return !this.isReadOnly;
			},
			anyValue    : function () {
				let _self = this;
				if (_self.values != null) {
					return _self.values.length > 0;
				} else {
					return false;
				}
			}
		},
		watch        : {
			value : function (value) {
				this.values = value instanceof Array ? value : [];
			}
		},
		data         : function () {
			return {
				name      : null,
				canBrowse : false,
				values    : []
			}
		}
	};
});