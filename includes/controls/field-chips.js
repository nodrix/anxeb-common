'use strict';

anxeb.vue.include.component('field-chips', function (helpers) {
	return {
		template     : '/controls/field-chips.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'type', 'value', 'direction', 'alt-fields'],
		mounted      : function () {
			let _self = this;
			_self.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression) : null;

			$(document).bind('mouseup.' + _self.name, function (e) {
				let box = $(_self.$refs.txtChip);
				let button = $(_self.$refs.browseButton);

				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});
			_self.normalizeInput();
		},
		destroyed    : function () {
			$(document).unbind('mouseup.' + this.name);
		},
		created      : function () {

		},
		data         : function () {
			return {
				newChips  : null,
				name      : null,
				chips     : [],
				canBrowse : false
			}
		},
		methods      : {
			clear : function () {
				let _self = this;
				_self.$emit('input', []);
				_self.reset();
			},
			normalizeInput : function () {
				let _self = this;

				if (_self.value instanceof Array) {
					this.chips = _self.value;
				} else {
					this.chips = [];
					_self.reset();
				}
			},
			browse         : function () {
				let _self = this;

				_self.canBrowse = !_self.canBrowse;
				if (!_self.canBrowse) {
					_self.reset();
				} else {
					setTimeout(function () {
						$(_self.$refs.txtChip).val('');
						$(_self.$refs.txtChip).focus();
					}, 0);
				}
			},
			cancel         : function () {
				this.reset();
			},
			enter          : function () {
				let _self = this;

				let chips = _self.newChips ? _self.newChips.split(',').filter(item => item != null && item.trim().length > 0).map(item => item.trim()) : [];

				if (chips.length > 0) {
					chips.iterate((chip) => {
						_self.chips.push({
							name : chip
						});
					});
					_self.$emit('input', _self.chips);
				}
				this.reset();
			},
			reset          : function () {
				this.newChips = null;
				this.canBrowse = false;
				this.selected = null;
			},
			remove         : function (chip, index) {
				this.chips.splice(index, 1);
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
				if (_self.chips != null) {
					return _self.chips.length > 0;
				} else {
					return false;
				}
			}
		},
		watch        : {
			value : function (value) {
				this.normalizeInput();
			}
		}
	};
});