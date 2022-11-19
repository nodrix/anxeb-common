'use strict';

anxeb.vue.include.component('drop-area', function (helpers) {
	return {
		props    : ['height', 'width', 'accept', 'accept-warning'],
		inject   : ['page', 'log', 'modal', 'dialogs'],
		template : '/components/drop-area.vue',
		methods  : {
			enter   : function (e) {
				let _self = this;
				_self.count++;
			},
			leave   : function (e) {
				let _self = this;
				_self.count--;
			},
			dropped : function (e) {
				let _self = this;
				if (_self.count > 0) {
					_self.count = 0;

					let files = e.dataTransfer.files;
					if (files.length === 1) {
						let $file = files[0];
						let $accept = _self.accept;
						let $allowed = true;

						if (_self.accept != null) {
							if (_self.accept instanceof Array) {
								$allowed = _self.accept.find((item) => $file.type.includes(item));
							} else {
								if ($accept.endsWith('*')) {
									$accept = $accept.replaceAll('*', '');
									$allowed = $file.type.startsWith($accept);
								} else {
									$allowed = $file.type === $accept
								}
							}
						}

						if ($allowed) {
							_self.$emit('dropped', $file);
						} else {
							_self.log(_self.acceptWarning || 'No se permite este tipo de archivo').exception();
						}
					} else {
						_self.log('Solo puede arrastrar un archivo a la vez').exception();
					}
				}
			}
		},
		mounted  : function () {
			let _self = this;

		},
		data     : function () {
			return {
				count : 0
			}
		},
		watch    : {},
		computed : {
			dragging : function () {
				return this.count > 0;
			}
		}
	}
});