'use strict';

anxeb.vue.include.component('field-image', function (helpers) {

	return {
		template     : '/controls/field-image.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'url', 'alt-url', 'height', 'width', 'field-name', 'size', 'can-preview', 'drop-color', 'value'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);

			if (this.image == null && this.value != null && typeof this.value === 'string') {
				_self.setupBlob(this.value);
			}
		},
		data         : function () {
			return {
				name  : null,
				image : null
			}
		},
		methods      : {
			setupBlob : function (data) {
				let _self = this;
				var xhr = new XMLHttpRequest();
				xhr.open("GET", data);
				xhr.responseType = "blob";
				xhr.onload = function (e) {
					var urlCreator = window.URL || window.webkitURL;
					var imageUrl = urlCreator.createObjectURL(this.response);
					_self.image = {
						data : data,
						href : imageUrl
					}
				};
				xhr.send();
			},
			reset     : function () {
				let _self = this;
				_self.image = null;
				_self.$emit('input', null);
			},
			preview   : function () {
				let _self = this;

				if (_self.canPreview === 'true' || _self.canPreview === true) {
					window.open(_self.current_url, '_blank');
				}
			},
			browse    : function () {
				let _self = this;

				helpers.browse.image().then(function (image) {
					_self.image = image;
					_self.$emit('input', image.data);
				}).catch(function (err) {
					_self.$parent.log('Error cargando imagen').exception();
				});
			}
		},
		watch        : {
			value : function (value) {
				let _self = this;
				if (value == null) {
					_self.reset();
				} else if (_self.image == null && typeof value === 'string') {
					_self.setupBlob(value);
				}
			}
		},
		computed     : {
			current_url   : function () {
				let _self = this;
				if (_self.image && _self.image.href) {
					return _self.image.href;
				} else {
					if (_self.url) {
						let query = _self.url.indexOf('?') === -1 ? '?webp=80&t=' + (_self.$root.profile.tick || '') : '';
						return _self.url + query;
					} else {
						return null;
					}
				}
			},
			current_image : function () {
				let _self = this;
				if (_self.image && _self.image.href) {
					return 'url(' + _self.image.href + ')';
				} else {
					if (_self.url) {
						let query = _self.url.indexOf('?') === -1 ? '?webp=80&t=' + (_self.$root.profile.tick || '') : '';
						let altQuery = (_self.altUrl != null && _self.altUrl.indexOf('?') === -1) ? '' : '?t=' + _self.$root.profile.tick;

						if (_self.altUrl) {
							return 'url(' + _self.url + query + '), url(' + _self.altUrl + altQuery + ')';
						} else {
							return 'url(' + _self.url + query + ')';
						}
					} else {
						return null;
					}
				}
			}
		}
	};
});