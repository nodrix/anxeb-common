'use strict';

anxeb.vue.include.component('report-preview', function (helpers) {
	let _modal = null;
	let _reject = null;
	let _resolve = null;

	return {
		template : '/components/report-preview.vue',
		created  : function () {
			let _self = this;
			_modal = _self.$parent;
			_reject = _modal.component.reject;
			_resolve = _modal.component.resolve;

			_self.params = _modal.component.params;

			helpers.api.post('/report', _self.params).then(function (res) {
				_self.init();
			}).catch(function (err) {
				_modal.loaded = true;
				_modal.exception(err);
			});
		},
		computed : {
			openUrl     : function () {
				let _self = this;
				let params = helpers.tools.data.copy(_self.params);
				params.rebuild = true;
				let data = btoa(JSON.stringify(params));
				return '/report?data=' + data + '&t=' + _self.tick;
			},
			downloadUrl : function () {
				let _self = this;
				let params = helpers.tools.data.copy(_self.params);
				params.rebuild = true;
				params.download = true;
				let data = btoa(JSON.stringify(params));
				return '/report?data=' + data;
			}
		},
		methods  : {
			init : function () {
				let _self = this;

				_modal.setup({
					icon        : 'fa-print',
					title       : _self.params.caption || 'Vista Preliminar',
					size        : 'full',
					dismissable : true
				}, [{
					key    : 'download',
					text   : 'Descargar',
					action : function () {
						_self.$refs.downloadIframe.src = _self.downloadUrl;
					}
				}, {
					key    : 'open',
					text   : 'Abrir',
					action : function () {
						window.open(_self.openUrl + '#view=fit', '_blank');
					}
				}, {
					key    : 'refresh',
					text   : 'Recargar',
					action : function () {
						_self.tick = Date.now();
					}
				}, {
					key    : 'close',
					text   : 'Cerrar',
					close  : true,
					action : function () {
						if (_reject) {
							_reject()
						}
					}
				}]);

				_modal.loaded = true;
			}
		},
		data     : function () {
			return {
				tick   : 0,
				params : null,
				model  : {}
			};
		}
	}
});