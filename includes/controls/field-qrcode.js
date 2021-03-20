'use strict';

anxeb.vue.include.component('field-qrcode', function (helpers) {
	let _qr;

	return {
		vendors      : ['https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js'],
		template     : '/controls/field-qrcode.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'id', 'readonly', 'height', 'width', 'field-name', 'max-height', 'max-width', 'size', 'display-value'],
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

				let $size = _self.size || 200;
				if (_self.width > $size) {
					$size = _self.width;
				}
				if (_self.height > $size) {
					$size = _self.height;
				}

				_qr = new QRious({
					element : container,
					size    : $size,
					value   : value
				});
			},
			edit   : function () {
				this.$emit('click');
			}
		},
		computed     : {}
	};
});