'use strict';

anxeb.vue.include.component('form-success', function (helpers) {
	let _modal = null;

	return {
		template : '/components/success.vue',
		created  : function () {
			let _self = this;
			_modal = _self.$parent;
			let params = _modal.component.params;

			_self.action = params.action;
			_self.message = params.message;

			let buttons = [{
				text   : 'Aceptar',
				icon   : 'fa-check',
				key    : 'accept',
				close  : true,
				action : function () {
					_self.close();
				}
			}];

			if (_self.action != null) {
				buttons.unshift({
					text   : _self.action.label,
					icon   : _self.action.icon,
					key    : 'action',
					action : function () {
						_self.action.callback(_modal);
					}
				});
			}

			_modal.setup({
				header      : false,
				centered    : true,
				size        : 'small',
				dismissable : true,
				radius      : '12px',
				onPress     : function (key) {
					if (key.code === 13) {
						_self.close();
					} else if (_self.action != null && _self.action.key != null && key.code === _self.action.key) {
						_self.action.callback(_modal);
					}
				}
			}, buttons);
		},
		methods  : {
			close : function () {
				_modal.close();
			}
		},
		computed : {},
		data     : function () {
			return {
				message : null,
				action  : null
			};
		}
	}
})
;