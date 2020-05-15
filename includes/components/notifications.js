'use strict';

anxeb.vue.include.component('notifications', function (helpers) {
	let Alert = function (params) {
		let _self = this;

		_self.type = params.type;
		_self.message = params.message;
		_self.subtitle = params.subtitle;
		_self.visible = false;
		_self.key = Date.now();

		_self.show = function (callback) {
			_self.visible = true;
			setTimeout(function () {
				if (_self.visible) {
					_self.hide(callback);
				}
			}, params.delay || 3000);
		};

		_self.hide = function (callback) {
			_self.visible = false;
			setTimeout(function () {
				if (callback) {
					callback();
				}
			}, 250);
		}
	};

	return {
		template : '/components/notifications.vue',
		props    : ['max', 'delay', 'reversed', 'disabled', 'floating'],
		methods  : {
			push  : function (params) {
				if (this.disabled === true) {
					return;
				}
				let _self = this;
				let max = this.max || 1;
				params.delay = params.delay || this.delay;

				if (max > 0) {
					for (let i = 0; i <= _self.list.length - max - 1; i++) {
						let hid = _self.list[i];
						for (let d = _self.list.length - 1; d >= 0; d--) {
							if (_self.list[d] === hid) {
								_self.list.splice(d, 1);
							}
						}
					}
				}

				if (_self.current) {
					if (_self.current.type === params.type && _self.current.message === params.message) {
						return;
					}
				}

				let alert = new Alert(params);
				_self.list.push(alert);
				alert.show(function () {
					for (let d = _self.list.length - 1; d >= 0; d--) {
						if (_self.list[d] === alert) {
							_self.list.splice(d, 1);
						}
					}
				});
			},
			clear : function () {
				this.list = [];
			}
		},
		data     : function () {
			return {
				list : []
			}
		},
		computed : {
			current : function () {
				return this.list.length ? this.list[this.list.length - 1] : null;
			},
			items   : function () {
				if (this.reversed === 'false') {
					return this.list;
				} else {
					return this.list.slice().reverse();
				}
			}
		}
	}
});