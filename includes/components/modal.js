'use strict';

anxeb.vue.include.component('modal', function (helpers) {

	let Button = function (params, modal) {
		let _self = this;
		let _busy = false;
		_self.modal = modal;
		_self.modal = modal;

		_self.key = params.key;
		_self.close = params.close;
		_self.prompted = params.prompted;
		_self.width = params.width;
		_self.class = params.class;
		_self.icon = params.icon;
		_self.text = params.text;
		_self.disabled = params.disabled;
		_self.busy = params.busy;
		_self.visible = params.visible;

		_self.action = async function () {
			if (_busy === false) {
				_busy = true;

				let actionResult;

				if (params.action) {
					_self.modal.busy();
					actionResult = await params.action(_self, _self.modal);
					_self.modal.idle();
				}
				if (_self.close === true && actionResult !== false) {
					_self.modal.close();
				}
				_busy = false;
			}
		};
	};

	return {
		vendors  : ['/vendors/v-calendar/v-calendar.umd.min.js', '/styles/modal.css', '/styles/calendar.css'],
		template : '/components/modal.vue',
		props    : ['float', 'fade'],
		watch    : {
			'$root.keyboard.pressed' : {
				deep    : true,
				handler : function (key) {
					let _self = this;

					if (_self.onPress) {
						_self.onPress(key);
					}

					if (_self.dismissable) {
						let code = key.code;

						if (!_self.$root.flags.modal) {
							return;
						}

						let isEsc = code === 27;

						if (isEsc) {
							_self.close();
						}
					}
				}
			},
			active                   : function (value) {
				let _self = this;

				setTimeout(function () {
					if (_self.fade !== false && _self.fade !== 'false') {
						if (value) {
							$(_self.$refs.modalElement).fadeIn(200);
						} else {
							$(_self.$refs.modalElement).fadeOut(100, function () {
								_self.component = null;
								if (_self.$refs && _self.$refs.notifications) {
									_self.$refs.notifications.clear();
								}
							});
						}
					} else {
						if (value) {
							$(_self.$refs.modalElement).show();
						} else {
							$(_self.$refs.modalElement).hide();
						}
					}
					_self.$emit('state-change', value);
				}, 0);
			},
			date                     : function () {
				this.updateDateTime();
			},
			time                     : function () {
				this.updateDateTime();
			}
		},
		methods  : {
			enter          : function () {
				let _self = this;
				if ((_self.prompt.required === false || (_self.value != null && _self.value.length > 0)) && _self.prompt.enterEvent === true) {

					for (let b in _self.buttons) {
						let button = _self.buttons[b];
						if (button.prompted) {
							button.action();
						}
					}
				}
			},
			reset          : function () {
				this.active = false;
				this.component = null;
				if (this.$refs && this.$refs.notifications) {
					this.$refs.notifications.clear();
				}
			},
			cancel         : function () {
				if (this.onCancel) {
					this.active = false;
					this.onCancel({
						key : 'CANCEL'
					});
				}
			},
			close          : function () {
				this.idle();
				this.active = false;
			},
			setup          : function (params, buttons) {
				let _self = this;
				_self.onCancel = params.onCancel || _self.onCancel;
				_self.title = params.title || _self.title;
				_self.prompt = params.prompt;
				_self.dismissable = params.dismissable;
				_self.onPress = params.onPress;
				_self.size = params.size != null ? params.size : 'normal';
				_self.width = params.width || null;

				_self.isDateTime = _self.prompt && _self.prompt.type === 'calendar-time';
				_self.width = _self.isDateTime ? '650px' : _self.width;
				_self.size = _self.isDateTime ? null : _self.size;

				_self.icon = params.icon || _self.icon;
				_self.message = params.message || _self.message;
				_self.component = params.component || _self.component;
				_self.loaded = params.loaded !== undefined ? params.loaded : true;
				_self.header = params.header;
				_self.centered = params.centered;
				_self.radius = params.radius;

				_self.buttons = {};

				if (params.buttons) {
					for (let b = 0; b < params.buttons.length; b++) {
						let bparams = params.buttons[b];
						_self.$set(_self.buttons, bparams.key || b, new Button(bparams, _self));
					}
				}

				if (buttons) {
					for (let b = 0; b < buttons.length; b++) {
						let bparams = buttons[b];
						_self.$set(_self.buttons, bparams.key || b, new Button(bparams, _self));
					}
				}
			},
			show           : function (params, buttons) {
				let _self = this;
				if (_self.active === true) {
					return;
				}
				_self.key = (_self.$vnode.data.ref || 'modal') + Date.now();
				_self.value = null;
				_self.message = null;
				_self.setup(params, buttons);
				_self.active = true;

				if (typeof _self.prompt === 'object' && _self.prompt.value) {
					_self.value = _self.prompt.value;

					if (_self.isDateTime && _self.value != null) {
						_self.date = _self.value.format('YYYY-MM-DD');
						_self.time = _self.value.format('HH:mm');
					}
				}

				setTimeout(function () {
					if (_self.$refs.promptElement) {
						let el = $(_self.$refs.promptElement.$el).find(':input');
						if (el) {
							el.focus();
							setTimeout(function () {
								el.select();
							}, 0);
						}
					}
				}, 250);
			},
			exception      : function (err) {
				this.idle();
				err = typeof err === 'string' ? { message : err } : (err.response && err.response.data && err.response.data.message ? err.response.data : err);
				let message = err.message;
				helpers.tools.highlight(err);

				this.$refs.notifications.push({
					type    : 'exception',
					message : message
				})
			},
			information    : function (message) {
				this.idle();
				this.$refs.notifications.push({
					type    : 'information',
					message : message
				})
			},
			busy           : function () {
				this.isBusy = true;
			},
			idle           : function () {
				this.isBusy = false;
			},
			formatDate     : function (value) {
				return moment(value).format('D [de] MMMM');
			},
			updateDateTime : function () {
				this.value = moment(this.date + ' ' + this.time);
			}
		},
		computed : {
			promptLabel   : function () {
				return typeof this.prompt === 'string' ? this.prompt : this.prompt.label;
			},
			buttonsLength : function () {
				let count = 0;
				for (var b in this.buttons) {
					count++;
				}
				return count;
			}
		},
		data     : function () {
			return {
				id          : this.$vnode.data.ref || 'modal',
				key         : null,
				title       : null,
				dismissable : false,
				onPress     : null,
				prompt      : null,
				value       : null,
				date        : null,
				time        : null,
				icon        : null,
				loaded      : true,
				component   : null,
				buttons     : {},
				message     : null,
				onCancel    : null,
				active      : false,
				size        : 'normal',
				width       : null,
				header      : null,
				centered    : null,
				radius      : null,
				isBusy      : false,
				isDateTime  : false
			}
		}
	}
});