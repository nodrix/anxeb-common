'use strict';

anxeb.vue.include.component('field-barcode', function (helpers) {
	return {
		template     : '/controls/field-barcode.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'id', 'readonly', 'url', 'alt-url', 'height', 'width', 'field-name', 'max-height', 'max-width', 'size', 'display-value'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
			this.render();
		},
		data         : function () {
			return {
				name : null,
				code : null
			}
		},
		watch        : {
			value : function () {
				this.render();
			}
		},
		methods      : {
			render : function () {
				let _self = this;
				let container = _self.$refs.container;
				let value = _self.value;
				let format = undefined;

				if (value != null) {
					if (value.length === 13) {
						format = 'ean13'
					} else if (value.length === 8) {
						format = 'ean8'
					} else if (value.length === 5) {
						format = 'ean5'
					} else if (value.length === 2) {
						format = 'ean2'
					} else if (value.length === 12) {
						format = 'upc';
					}
				}

				let build = function (format) {
					JsBarcode(container, value, {
						width        : _self.size != null && _self.size.width != null ? _self.size.width : 3.3,
						height       : _self.size != null && _self.size.height != null ? _self.size.height : 190,
						displayValue : _self.displayValue != null ? _self.displayValue : true,
						fontSize     : _self.size != null && _self.size.font != null ? _self.size.font : 28,
						lineColor    : 'black',
						marginLeft   : _self.size != null && _self.size.margin != null ? _self.size.margin : 30,
						marginRight  : _self.size != null && _self.size.margin != null ? _self.size.margin : 30,
						marginTop    : _self.size != null && _self.size.spacing != null ? _self.size.spacing : undefined,
						marginBottom : _self.size != null && _self.size.spacing != null ? _self.size.spacing : undefined,
						format       : format
					});
				};

				try {
					build(format);
				} catch (e) {
					build();
				}
			},
			edit   : function () {
				this.$emit('click');
			}
		},
		computed     : {}
	};
});