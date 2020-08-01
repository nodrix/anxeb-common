'use strict';

anxeb.vue.include.component('drop-area', function (helpers) {
	return {
		props    : [],
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
						_self.$emit('dropped', files[0]);
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