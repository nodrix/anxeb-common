'use strict';

anxeb.vue.include.component('top-header', function (helpers) {
	return {
		props    : ['type'],
		template : '/components/top-header.vue',
		methods  : {
			setup            : function (params) {
				this.title = params.title;
				this.subtitle = params.subtitle;
				this.icon = params.icon;
				this.action = params.action;

				if (params.caption !== undefined) {
					this.caption = params.caption;
				}
			},
			subpage          : function (params) {
				this.sufix = params.sufix;
				this.prefix = params.prefix;

				if (params.caption) {
					this.caption = params.caption;
				}
				if (params.icon) {
					this.icon = params.icon;
				}
				if (params.action) {
					this.action = params.action;
				}
			},
			actionCall       : function () {
				if (this.action) {
					this.action();
				}
			},
			toggleFullScreen : function (force) {
				let _self = this;
				let elem = document.documentElement;
				if (!this.fullscreen || force === true) {
					if (elem.requestFullscreen) {
						elem.requestFullscreen();
					} else if (elem.mozRequestFullScreen) {
						elem.mozRequestFullScreen();
					} else if (elem.webkitRequestFullscreen) {
						elem.webkitRequestFullscreen();
					} else if (elem.msRequestFullscreen) {
						elem.msRequestFullscreen();
					}
				} else {
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.msExitFullscreen) {
						document.msExitFullscreen();
					}
				}

				setTimeout(function () {
					_self.fullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
				}, 300);
			}
		},
		data     : function () {
			return {
				fullscreen : false,
				title      : '',
				subtitle   : '',
				sufix      : '',
				prefix     : '',
				icon       : '',
				action     : null,
				actions    : {
					refresh  : null,
					settings : null,
					logout   : null
				}
			}
		},
		computed : {
			fullTitle : function () {
				return (this.prefix || '') + this.title + (this.sufix || '');
			}
		}
	}
});