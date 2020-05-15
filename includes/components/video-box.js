'use strict';

anxeb.vue.include.component('video-box', function (helpers) {
	return {
		props    : ['source', 'inverted', 'height', 'width', 'caption', 'reset', 'automute', 'controls', 'failed', 'levels', 'identity', 'radius', 'toggle', 'icon-size', 'icon-color', 'audio-toggler'],
		template : '/components/video-box.vue',
		mounted  : function () {
			let _self = this;
			_self.canvasCtx = _self.$refs.canvas.getContext("2d");

			let _refreshMetas = function () {
				if (_self.stream) {
					let videoTracks = _self.stream.getVideoTracks();
					let track = videoTracks[0];
					let settings = track.getSettings();
					_self.meta.ratio = settings.aspectRatio;
					_self.meta.id = settings.deviceId;
					_self.meta.fps = settings.frameRate;
					_self.meta.height = settings.height;
					_self.meta.width = settings.width;
					_self.meta.resize = settings.resizeMode;

					_self.refreshSize(_self.meta.ratio);
				}
			}

			_self.refreshSize(4 / 3);

			_self.video.onloadstart = _self.video.onloadstart || function () {
				_self.state.busy = true;
			}

			_self.video.oncanplay = _self.video.oncanplay || function () {
				_refreshMetas();

				setTimeout(function () {
					_self.video.play();

					if (_self.automute === false) {
						_self.video.muted = false;
					} else {
						_self.video.muted = true;
					}

					_self.state.busy = false;
					_self.state.video = true;

					_self.state.paused = _self.video.paused;
					_self.state.muted = _self.video.muted;

					_self.$emit('live', _self.identity);

					if (_self.state.muted) {
						_self.stopAudioAnalysis();
					} else {
						_self.initAudioAnalysis();
					}
				}, 500);
			}

			_self.video.onplay = _self.video.onplay || function () {
				_self.state.busy = false;
			}

			_self.video.onplaying = _self.video.onplaying || function () {
				_self.state.busy = false;
			}

			_self.video.onwaiting = _self.video.onwaiting || function () {
				_self.state.busy = true;
			}

			_self.video.onended = _self.video.onended || function () {
				_self.state.video = false;
			}

			_self.video.onprogress = _self.video.onprogress || function () {

			}

			_self.video.emptied = _self.video.emptied || function () {
				_self.state.video = false;
			}
		},
		methods  : {
			refreshSize       : function (ratio) {
				let _self = this;
				if (_self.width != null && _self.height != null) {
					_self.size.width = _self.width;
					_self.size.height = _self.height;
				} else if (_self.width != null && ratio != null) {
					_self.size.width = _self.width + 'px';
					_self.size.height = Number(parseFloat(_self.width.toString().replaceAll('px', '')) / ratio).toFixed(0) + 'px'
				} else if (_self.height != null && ratio != null) {
					_self.size.width = Number(parseFloat(_self.height.toString().replaceAll('px', '')) * ratio).toFixed(0) + 'px'
					_self.size.height = _self.height
				} else {
					_self.size.width = $(_self.$refs.container).width();
					_self.size.height = Number(_self.size.width / ratio).toFixed(0) + 'px'
				}
			},
			start             : function (stream) {
				let _self = this;

				if (stream != null) {
					_self.video.autoplay = false;
					_self.video.muted = true;
					_self.video.srcObject = stream;
					_self.stream = stream;
				} else {
					_self.stop();
				}
			},
			stopAudioAnalysis : function () {
				let _self = this;
				_self.analyser = null;
				_self.loudness = 0;
				_self.dbs = [];
			},
			initAudioAnalysis : function () {
				let _self = this;

				if (_self.stream && _self.stream.getAudioTracks().length) {
					var audioContext = new AudioContext();
					let audioSource = audioContext.createMediaStreamSource(_self.stream);
					_self.analyser = audioContext.createAnalyser();
					_self.analyser.fftSize = 2048;
					_self.analyserDataArray = new Uint8Array(_self.analyser.frequencyBinCount);
					_self.analyser.getByteTimeDomainData(_self.analyserDataArray);
					audioSource.connect(_self.analyser);

					if (_self.levels === true || _self.levels === 'true') {
						_self.draw();
					}
					_self.refreshLoudness();
				}
			},
			draw              : function () {
				if (!_self.analyser) {
					return;
				}

				let _self = this;
				let canvas = _self.$refs.canvas;

				_self.analyser.getByteTimeDomainData(_self.analyserDataArray);
				_self.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
				_self.canvasCtx.fillStyle = "rgb(200, 200, 200, 0)";
				_self.canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
				_self.canvasCtx.lineWidth = 2;
				_self.canvasCtx.strokeStyle = "rgb(0, 0, 0)";
				_self.canvasCtx.beginPath();

				var sliceWidth = canvas.width / _self.analyserDataArray.length;
				var x = 0;
				for (var i = 0; i < _self.analyserDataArray.length; i++) {
					let data = _self.analyserDataArray[i];
					var y = (data / 128.0) * canvas.height / 2;
					if (i === 0) {
						_self.canvasCtx.moveTo(x, y);
					} else {
						_self.canvasCtx.lineTo(x, y);
					}
					x += sliceWidth;
				}
				_self.canvasCtx.lineTo(canvas.width, canvas.height / 2);
				_self.canvasCtx.stroke();
				setTimeout(function () {
					_self.draw();
				}, 30);
			},
			refreshLoudness   : function () {
				let _self = this;
				if (!_self.analyser) {
					return;
				}
				_self.analyser.getByteTimeDomainData(_self.analyserDataArray);
				let max = 0;
				let min = 0;

				for (var i = 0; i < _self.analyserDataArray.length; i++) {
					let data = _self.analyserDataArray[i] - 128;
					if (data > max) {
						max = data;
					}
					if (data < min) {
						min = data;
					}
				}

				_self.dbs.unshift(max - min)

				if (_self.dbs.length > 12) {
					_self.dbs.pop();
				}

				let db = 0;
				for (let i = 0; i < _self.dbs.length; i++) {
					db += _self.dbs[i];
				}

				let loudness = Number(db / _self.dbs.length).toFixed(2);

				if (loudness !== _self.loudness) {
					_self.loudness = loudness;
					_self.$emit('levels-change', _self.identity, _self.loudness);
				}

				setTimeout(function () {
					_self.refreshLoudness();
				}, 300);
			},
			stop              : function () {
				let _self = this;
				_self.video.srcObject = null;
				_self.stream = null;
				_self.state.video = false;
				_self.stopAudioAnalysis();
			},
			toggleAudio       : function () {
				let _self = this;
				_self.video.muted = !_self.video.muted;

				_self.state.paused = _self.video.paused;
				_self.state.muted = _self.video.muted;

				if (_self.state.muted) {
					_self.stopAudioAnalysis();
				} else {
					_self.initAudioAnalysis();
				}
			},
			toggleVideo       : function () {
				let _self = this;
				if (_self.video.paused) {
					_self.video.play();
				} else {
					_self.video.pause();
				}

				_self.state.paused = _self.video.paused;
				_self.state.muted = _self.video.muted;

				if (_self.state.paused) {
					_self.stopAudioAnalysis();
				} else {
					_self.initAudioAnalysis();
				}
			}
		},
		data     : function () {
			return {
				canvasCtx         : null,
				analyser          : null,
				analyserDataArray : null,
				stream            : null,
				dbs               : [],
				flags             : {},
				loudness          : 0,
				meta              : {
					ratio  : null,
					id     : null,
					fps    : null,
					height : null,
					width  : null,
					resize : null
				},
				state             : {
					video  : false,
					busy   : false,
					failed : false,
					paused : false,
					muted  : true
				},
				size              : {
					width  : null,
					height : null
				}
			}
		},
		computed : {
			video : function () {
				return this.$refs.video;
			}
		},
		watch    : {
			height : function () {
				this.refreshSize(4 / 3);
			},
			width  : function () {
				this.refreshSize(4 / 3);
			},
			failed : function (failed) {
				this.state.failed = failed;
			},
			source : function (stream) {
				this.start(stream);
			}
		}
	}
});