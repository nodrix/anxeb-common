'use strict';

anxeb.vue.include.helper('socket', function () {
	let _host = anxeb.settings.client.api;

	let Client = function (params, pipe) {
		let _self = this;
		let _pipe = pipe;
		let _lats = [];
		_self.state = _pipe.connected ? 'connected' : 'disconnected';
		_self.error = null;
		_self.pings = 0;
		_self.pongs = 0;
		_self.ratio = 0;
		_self.latency = null;
		_self.attempts = 0;
		_self.room = params.room || null;
		_self.key = params.key || null;
		_self.path = params.path || null;

		_self.catch = function (callback) {
			_self.onError = callback;
			return _self;
		};

		_self.updated = function (callback) {
			_self.onUpdated = callback;
			return _self;
		};

		Object.defineProperty(_self, 'connected', {
			get : () => _pipe.connected
		});

		Object.defineProperty(_self, 'disconnected', {
			get : () => _pipe.disconnected
		});

		_self.join = function (room) {
			_self.emit('join_room', room);
			return _self;
		};

		_self.leave = function (room) {
			_self.emit('leave_room', room);
			return _self;
		};

		_self.dispose = function () {
			_pipe.close();
			_handleEvent('dispose', 'disposed', null);
		};

		_self.open = function () {
			return _pipe.open.apply(_pipe, Array.from(arguments));
		}

		_self.close = function () {
			return _pipe.close.apply(_pipe, Array.from(arguments));
		}

		_self.disconnect = function () {
			return _pipe.disconnect.apply(_pipe, Array.from(arguments));
		}

		_self.send = function () {
			_pipe.send.apply(_pipe, Array.from(arguments));
			return _self;
		}

		_self.on = function (event, callback) {
			_pipe.on(event, function () {
				let args = Array.from(arguments);
				try {
					return callback.apply(null, args);
				} catch (err) {
					console.error('Internal error when executing \'' + event + '\' callback on ' + _self.path + '. ' + err.message);
					if (_self.onError != null) {
						_self.onError(err);
					}
				}
			});
			return _self;
		}

		_self.emit = function (event, data, success, failed) {
			try {
				_pipe.emit(event, data, function (res) {
					if (res != null && typeof res === 'object' && res.message != null && res.code != null && res.source === 'socket_event_error') {
						failed(res);
					} else {
						success(res);
					}
				});
				return _self;
			} catch (err) {
				failed(err);
			}
		}

		let _handleEvent = function (event, state, err) {
			let $from = _self.state;
			let $to = state;
			_self.state = state;

			if (err !== undefined) {
				_self.error = err;
			}
			if (_self.onUpdated) {
				_self.onUpdated(_self, event, {
					from : $from,
					to   : $to
				});
			}
		}

		_pipe.on('connect', () => {
			_handleEvent('connect', 'connected', null);
		});

		_pipe.on('connect_error', (err) => {
			if (_self.onError != null) {
				_self.onError(err);
			}
			_handleEvent('connect_error', 'disconnected', err);
		});

		_pipe.on('connect_timeout', (timeout) => {
			_handleEvent('connect_timeout', 'timeout');
		});

		_pipe.on('error', (error) => {
			let err = typeof error === 'string' && error.indexOf('{') > -1 && error.indexOf('}') > -1 ? JSON.parse(error) : error;
			_self.error = err;

			if (err && typeof err !== 'string' && (err.code === 401 || err.code === 6013 || err.code === 6012 || err.code === 6006)) {
				_self.dispose();
				anxeb.vue.root.session.reset();
			}

			if (_self.onError != null) {
				_self.onError(err);
			}

			_handleEvent('error', 'error', error);
		});

		_pipe.on('disconnect', (reason) => {
			_handleEvent('disconnect', reason.replaceAll(' ', '_'));

			if (reason === 'io server disconnect') {
				_pipe.connect();
			}
		});

		_pipe.on('reconnecting', (attemptNumber) => {
			_self.attempts = attemptNumber;

			_handleEvent('reconnecting', 'disconnected');
		});

		_pipe.on('reconnect_error', (error) => {
			_handleEvent('reconnect_error', 'disconnected', error);
		});

		_pipe.on('reconnect_failed', () => {
			_handleEvent('reconnect_failed', 'disconnected');
		});

		_pipe.on('ping', () => {
			_self.pings++;
			if (_self.onPing) {
				_self.onPing(_self);
			}
		});

		_pipe.on('pong', (latency) => {
			_lats.unshift(latency);
			if (_lats.length > 20) {
				_lats.pop();
			}

			_self.pongs++;
			_self.ratio = Number(parseFloat(_self.pongs / _self.pings).toFixed(3));

			let latencyProm = 0;
			for (let i = 0; i < _lats.length; i++) {
				latencyProm += _lats[i];
			}
			_self.latency = Number(parseInt(latencyProm / _lats.length));

			if (_self.onPong) {
				_self.onPong(_self);
			}
		});

		_self.id = pipe.id;
	}

	return {
		open : function (params, onErrorCallback) {
			let token = localStorage.token;
			let headers = (params != null ? params.headers : {}) || {};
			if (token) {
				headers['Authorization'] = 'Bearer ' + token;
			}

			if (params.room) {
				headers['client-room'] = params.room;
			}

			if (params.key) {
				headers['client-key'] = params.key;
			}

			let transport = params.transport || 'polling';

			let pipe = new io(_host + params.path, {
				forceNew          : true,
				query             : params ? params.query : undefined,
				reconnect         : true,
				reconnection      : true,
				reconnectionDelay : 800,
				timeout           : 2000,
				autoConnect       : true,
				transports        : [transport],
				transportOptions  : {
					polling : { extraHeaders : headers }
				}
			});

			return new Client({
				path            : params.path,
				room            : params.room || undefined,
				key             : params.key || undefined,
				onErrorCallback : onErrorCallback
			}, pipe);
		}
	};
});