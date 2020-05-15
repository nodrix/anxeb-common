'use strict';

anxeb.vue.include.helper('peer', function () {

	let Peer = function (params) {
		let _self = this;
		let _id = params.id;
		let _socket = params.socket;
		let _isSender = params.sender;

		_self.key = params.key;
		_self.name = params.name;
		_self.stream = null;

		let _onEvent = function (msg, params) {
			if (params.onEvent) {
				params.onEvent(_self, msg, params);
			}
		}

		let _debug = function (msg) {
			console.log(_self.name + ': ' + msg);
		}

		let _log = function (msg, color) {
			_debug(msg);
			_onEvent(msg, {
				type  : 'signal',
				color : color || 'rgba(210,221,243,0.8)'
			});
		}

		let _error = function (obj) {
			let msg = typeof obj === 'string' ? obj : obj.message;
			console.error(_self.name + ': ' + msg);
			_onEvent(msg, {
				type  : 'signal',
				color : '#ffcfcf'
			});
		}

		let _deamon = function () {
			setTimeout(async function () {
				if (_self.state.disposed) {
					_debug('deamon disposed');
					return;
				}
				_deamon();

				try {
					_self.state.refresh();
					if (_self.state.idle) {
						await _self.emit.ping({
							stats : {
								latency : _socket.latency,
								live    : _self.state.live
							}
						});
					}
				} catch (err) {
					_error(err);
				}
			}, 3000);
		}

		let _processing = function (value) {
			if (value) {
				if (!_self.state.processing) {
					_self.state.processing = true;
				}
			} else {
				if (_self.state.processing) {
					_self.state.processing = false;
				}
			}
			_self.state.refresh();
		};

		let _isLive = function () {
			if (_self.stream != null) {
				if (_self.stream.active) {
					let tracks = _self.stream.getTracks();
					for (let t = 0; t < tracks.length; t++) {
						let track = tracks[t];
						if (track.kind === 'video' && track.readyState === 'live' && track.enabled === true) {
							return true;
						}
					}
				}
			}
			return false;
		}

		let _buildConnection = function () {
			_self.connection = new RTCPeerConnection({
				iceServers : [
					{ urls : 'stun:stun.services.mozilla.com' },
					{ urls : 'stun:stun.l.google.com:19302' },
					{ urls : 'stun:stun1.l.google.com:19302' },
					{ urls : 'stun:stun2.l.google.com:19302' },
					{ urls : 'stun:stun3.l.google.com:19302' },
					{ urls : 'stun:stun4.l.google.com:19302' },
					{ urls : 'stun:stun.ekiga.net' },
					{ urls : 'stun:stun.fwdnet.net' },
					{ urls : 'stun:stun.ideasip.com' }
				]
			});

			_self.connection.onsignalingstatechange = function () {
				_log('signal state changed to ' + _self.state.signal);
				_self.state.refresh();
			}

			_self.connection.onconnectionstatechange = function () {
				_debug('connection state: ' + _self.connection.connectionState);
				_self.state.refresh();


				if (_self.connection.connectionState === 'failed' && !_isSender) {
					setTimeout(async function () {
						setTimeout(function () {
							_debug('connection failed: requesting remote reset');
							_self.send.reset();
						}, 1000);
					}, 2000);
				}
			}

			_self.connection.onicecandidate = function (event) {
				let $ice = event.candidate;
				if ($ice != null) {
					_self.emit.ice($ice);
				}
				_self.state.refresh();
			};

			_self.connection.onremovestream = function () {
				_self.stream = null;
				_self.state.refresh();
			}

			_self.connection.ontrack = function (event) {
				let track = event.track;
				if (track) {
					_self.stream = event.streams && event.streams[0] ? event.streams[0] : new MediaStream();
					_debug('adding ' + track.kind + ' track');
					_self.stream.addTrack(track);

					setTimeout(function () {
						let stats = '\n';
						stats += '  id      :' + track.id + '\n';
						stats += '  kind    :' + track.kind + '\n';
						stats += '  enabled :' + track.enabled + '\n';
						stats += '  muted   :' + track.muted + '\n';
						stats += '  state   :' + track.readyState + '\n';
						stats += '  stream  :' + (_self.stream && _self.stream.active ? 'active' : 'inactive') + '\n';

						_debug(stats);
						_self.state.refresh();
					}, 800);

					track.onended = function () {
						_debug('ending ' + track.kind + ' track');

						_self.stream = null;
						_self.state.refresh();

						if (_self.onTrackEnded) {
							_self.onTrackEnded(track, _self.stream);
						}
					}

					if (_self.onTrackAdded) {
						_self.onTrackAdded(track, _self.stream);
					}
				}

				_debug('starting feed');
			}

			_self.connection.onnegotiationneeded = function () {
				_self.send.offer();
			}

			_self.connection.iceconnectionstatechange = function () {
				_debug('ice state: ' + _self.connection.iceConnectionState);
				if (_self.connection.iceConnectionState === 'failed') {
					_debug('restarting ice');
					_self.connection.restartIce();
				}
				_self.state.refresh();
			}
		}

		_buildConnection();

		if (_isSender) {
			_debug('deamon initialized');
			_deamon();
		}

		Object.defineProperty(_self, 'receivers', {
			get : function () {
				let receivers = _self.connection.getReceivers();
				return receivers;
			}
		});

		Object.defineProperty(_self, 'senders', {
			get : function () {
				let senders = _self.connection.getSenders();
				return senders;
			}
		});

		_self.stats = {
			latency : null
		}

		_self.state = {
			signal     : null,
			connection : null,
			live       : null,
			video      : false,
			active     : null,
			senders    : 0,
			receivers  : 0,
			processing : false,
			busy       : false,
			idle       : true,
			connected  : false,
			failed     : false,
			disposed   : false,
			loading    : false,
			display    : false,
			refresh    : function () {
				this.signal = _self.connection.signalingState;
				let $connection = this.connection;
				this.connection = _self.connection.connectionState;
				this.live = _isLive();
				this.video = _self.stream != null;
				this.connected = this.connection === 'connected';
				this.failed = this.connection === 'failed';
				this.active = _self.stream != null && this.live && this.connected;
				this.senders = _self.senders.length;
				this.receivers = _self.receivers.length;
				this.busy = this.processing || this.connection === 'connecting';
				this.idle = !this.busy;

				if ($connection !== this.connection) {
					if (this.connection === 'connected') {
						this.connected = true;
						this.onConnect();
					}
				}

				this.loading = this.live && (!this.active || !this.video) && this.connection !== 'connected' && this.connection !== 'failed';
				this.display = this.loading || this.failed || this.live || this.processing || this.busy || this.connected || this.active;
			},
			onConnect  : function () {
				_debug('---------------------------------------')
				_debug('READY STATE');
				console.log('');
			}
		};

		_self.state.refresh();

		_self.start = async function (stream) {
			if (stream) {
				_self.stream = stream;
				_self.state.refresh();

				let tracks = _self.stream.getTracks();

				let senders = _self.senders;
				for (let t = 0; t < tracks.length; t++) {
					let track = tracks[t];

					let exist = false;
					for (let s = 0; s < senders.length; s++) {
						let sender = senders[s];
						if (sender.track === track) {
							exist = true;
							break;
						}
					}

					if (!exist) {
						await _self.connection.addTrack(track, _self.stream);
					}
				}
				_self.state.refresh();

				_self.send.offer();
			}
		};

		_self.stop = async function () {
			if (_self.stream) {
				_self.stream = null;
				_processing(true);
				await _self.send.close();
				_self.close();
				_self.state.refresh();
				_processing(false);
			}
		}

		_self.reset = async function () {
			if (_self.state.idle) {
				_processing(true);
				await _self.send.close();
				_self.close();
				_self.state.refresh();
				_processing(false);
				_self.start(_self.stream);
			}
		}

		_self.close = function () {
			_self.connection.close();
			_buildConnection();
			_processing(false);
		}

		_self.dispose = async function () {
			await _self.connection.close();
			_self.state.disposed = true;
			_self.state.refresh();
		}

		_self.send = {
			offer  : async function () {
				if (_self.state.signal === 'have-local-offer') {
					_processing(true);
					await _self.emit.description(_self.connection.localDescription);
				} else if (_self.state.signal === 'stable' && !_self.state.processing && _self.state.signal !== 'have-remote-offer' && _self.state.connection !== 'closed') {
					_processing(true);
					try {
						let offer = await _self.connection.createOffer();

						if (_self.state.signal !== 'have-remote-offer') {
							_debug('setting new offer');
							await _self.connection.setLocalDescription(offer);
							_debug('offer successfully set');
							await _self.emit.description(offer);
						}
					} catch (err) {
						_error(err);
					}
				}
			},
			answer : async function () {
				try {
					if (_self.state.signal !== 'stable' && _self.state.connection !== 'closed') {
						let answer = await _self.connection.createAnswer();
						_debug('setting new answer');
						if (_self.state.signal !== 'stable' && _self.state.connection !== 'closed') {
							await _self.connection.setLocalDescription(answer);
							_debug('answer successfully set');
							await _self.emit.description(answer);
						}
					}
				} catch (err) {
					_error(err);
				}
			},
			reset  : async function () {
				if (_self.state.idle) {
					_self.close();
					await _self.emit.action({
						code : 'reset'
					});
				}
			},
			close  : async function () {
				await _self.emit.action({
					code : 'close'
				});
			}
		}

		_self.receive = {
			action      : async function (params) {
				if (params.code === 'close') {
					_log('close request received');
					_self.close();
				}

				if (params.code === 'reset') {
					_log('reset request received');
					_self.reset();
				}
			},
			description : async function (description) {
				if (description && _self.state.connection !== 'closed') {
					_processing(true);
					try {
						_log(description.type + ' received on ' + _self.state.signal, 'rgba(0,6,52,0.25)');

						if (description.type === 'offer') {
							await _self.connection.setRemoteDescription(new RTCSessionDescription(description));
							_log('offer successfully set on ' + _self.state.signal);
							if (_self.state.signal === 'have-remote-offer' || _self.state.signal === 'have-local-pranswer') {
								if (_self.state.connection === 'closed') {
									_processing(false);
									return;
								}
								await _self.send.answer();
							}
						} else if (description.type === 'answer') {
							if (_self.state.signal !== 'stable' && _self.state.signal !== 'have-remote-offer') {
								await _self.connection.setRemoteDescription(new RTCSessionDescription(description));
								_log('answer successfully set on ' + _self.state.signal);
							}
						}
					} catch (err) {
						_debug(' ** error during signal ' + _self.state.signal)
						_error(err);
					} finally {
						_processing(false);
					}
				}
			},
			ice         : async function (ice) {
				try {
					if (_self.state.connection !== 'closed') {
						await _self.connection.addIceCandidate(new RTCIceCandidate(ice));
					}
				} catch (err) {
					_log('applying ice on ' + _self.state.signal);
					_error(err);
				}
			},
			ping        : async function (payload) {
				if (payload.stats) {
					_self.stats.latency = payload.stats.latency;
					let _isRemoteSending = payload.stats.live;
					let _isLocalReceiving = _self.state.live;

					if (_isRemoteSending === true && _isLocalReceiving === false) {
						_debug('live state not equal: requesting remote reset');
						_self.send.reset();
					} else if (_isRemoteSending === false && _isLocalReceiving === true) {
						_self.close();
					}
				}
			}
		};

		_self.emit = {
			description : function (description) {
				return new Promise(function (resolve, reject) {
					try {
						if (_self.state.connection !== 'closed') {
							_socket.emit('peer_local_sdp', {
								to  : _id,
								sdp : description,
								key : _self.key
							}, function () {
								resolve();
								_log(description.type + ' description sent', 'rgba(0,106,0,0.2)');
							}, function (err) {
								reject(err);
							});
						} else {
							resolve();
						}
					} catch (err) {
						reject(err);
					}
				});
			},
			ice         : async function (ice) {
				return new Promise(function (resolve, reject) {
					try {
						if (_self.state.connection !== 'closed') {
							_socket.emit('peer_local_ice', {
								to  : _id,
								ice : ice,
								key : _self.key
							}, function () {
								resolve();
							}, function (err) {
								reject(err);
							});
						} else {
							resolve();
						}
					} catch (err) {
						reject(err);
					}
				});
			},
			ping        : function (payload) {
				return new Promise(function (resolve, reject) {
					try {
						if (_self.state.connection !== 'closed') {
							_socket.emit('peer_local_ping', {
								to      : _id,
								payload : payload,
								key     : _self.key
							}, function (data) {
								resolve(data);
							}, function (err) {
								resolve(null);
							});
						} else {
							resolve(null);
						}
					} catch (err) {
						resolve(null);
					}
				});
			},
			action      : function (params) {
				return new Promise(function (resolve, reject) {
					try {
						if (_self.state.connection !== 'closed') {
							_socket.emit('peer_local_action', {
								to     : _id,
								key    : _self.key,
								params : params
							}, function (data) {
								resolve(data);
							}, function (err) {
								reject(err);
							});
						} else {
							resolve(null);
						}
					} catch (err) {
						reject(err);
					}
				});
			}
		}
	};

	return {
		create : function (params) {
			return new Peer(params);
		}
	};

});