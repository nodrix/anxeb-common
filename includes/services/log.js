'use strict';

anxeb.vue.include.service('log', function (helpers) {
	let broadcastNotification = function (from, alert) {
		from.$root.$broadcast('notifications', function (notifications) {
			if (notifications.push) {
				notifications.push(alert);
			}
		});
	};

	return function (component, obj) {
		let _message = null;
		let _subtitle = null;
		let _obj = obj;

		let init = function (params) {
			if (typeof _obj === 'object') {
				if (_obj.response && _obj.response.data && _obj.response.data.message) {
					_obj = _obj.response.data;
				}

				_subtitle = _obj.subtitle;

				if (params && params.force === true) {
					_message = _obj.message;
				} else {
					if (_obj.code === 401) {
						_message = 'Acceso Denegado';
					} else if (_obj.code === 6013) {
						_message = 'Token de acceso expirado, favor autenticarse nuevamente';
					} else if (_obj.code === 6012) {
						_message = 'Token de acceso inválido, favor autenticarse nuevamente';
					} else if (_obj.code === 6006) {
						_message = 'Token de acceso inválido, favor autenticarse nuevamente';
					} else {
						_message = _obj.message;
					}
					_obj.message = _message;
				}
			} else {
				_message = _obj;
			}
		};

		init();

		return {
			exception    : function (params) {
				if (params != null) {
					init(params);
				}
				helpers.root.page.idle();
				if (_message) {
					broadcastNotification(component, {
						type    : 'exception',
						message : _message
					});
				}
			},
			information  : function () {
				helpers.tools.unhighlight();
				helpers.root.page.idle();
				if (_message) {
					broadcastNotification(component, {
						type    : 'information',
						message : _message
					});
				}
			},
			notification : function () {
				helpers.tools.unhighlight();
				helpers.root.page.idle();
				if (_message) {
					broadcastNotification(component, {
						type     : 'notification',
						message  : _message,
						subtitle : _subtitle
					});
				}
			}
		};
	}
});