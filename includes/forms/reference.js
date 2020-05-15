'use strict';

anxeb.vue.include.component('form-reference', function (helpers) {
	return {
		template : '/forms/reference.vue',
		created  : function () {
			let _self = this;
			let modal = _self.$parent;
			let params = modal.component.params;
			let reject = modal.component.reject;
			let resolve = modal.component.resolve;

			let setup = function () {
				modal.setup({
					icon : 'fa-stream'
				}, [{
					text   : 'Guardar',
					action : function () {
						helpers.api.post('/references', { reference : _self.model }).then(function (res) {
							modal.close();
							resolve(res.data);
						}).catch(function (err) {
							modal.exception(err);
						});
					}
				}, {
					text   : 'Cancelar',
					close  : true,
					action : function () {
						if (reject) {
							reject()
						}
					}
				}]);
				modal.loaded = true;
			};

			if (typeof params === 'string') {
				helpers.api.get('/references/' + params).then(function (res) {
					_self.model = res.data;
					setup();
				}).catch(function (err) {
					modal.exception(err);
				});
			} else {
				_self.model = helpers.tools.data.copy(params);
				setup();
			}
		},
		data     : function () {
			return {
				model : {
					name : null,
					meta : null
				}
			};
		}
	}
});