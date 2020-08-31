'use strict';

anxeb.vue.include.component('panel', function (helpers) {
	return {
		props    : ['type', 'width', 'hide-footer', 'border', 'no-padding', 'color', 'over', 'icon', 'title', 'caption', 'offset', 'state', 'allow-collapse', 'max-width', 'min-width', 'label', 'hide-at', 'show-at'],
		template : '/components/panel.vue',
		methods  : {
			updateScroll : function () {
				let body = $(this.$refs.body);

				this.screen.width = $(window).width();

				if (body[0] != null) {
					var maxScroll = body[0].scrollHeight - body.outerHeight();
					var topScroll = body.scrollTop();

					this.scrollValue = parseInt(maxScroll - topScroll);
					if (this.scrollValue <= 1) {
						this.scrollValue = 0;
					}
				}
			},
			scrollDown   : function () {
				let body = $(this.$refs.body);
				if (body[0] != null) {
					var maxScroll = body[0].scrollHeight - body.outerHeight();
					body.stop().animate({ scrollTop : maxScroll }, 500, 'swing', function () {

					});
				}
			}
		},
		created  : function () {
			let _self = this;
			if (_self.state != null) {
				_self.visible = this.state;
			}
			$(window).resize(function () {
				if (_self.resizing === false) {
					_self.resizing = true;
					setTimeout(function () {
						_self.updateScroll();
						_self.resizing = false;
					}, 700);
				}
			});

			setTimeout(function () {
				_self.updateScroll();
			}, 800);
		},
		data     : function () {
			let _self = this;
			return {
				screen      : {
					width : $(window).width()
				},
				visible     : true,
				actions     : {
					hide : function () {
						_self.visible = false;
					}
				},
				scrollValue : null,
				resizing    : false
			}
		},
		watch    : {
			visible : function (value) {
				let _self = this;
				if (value) {
					setTimeout(function () {
						_self.updateScroll();
					}, 300);
				} else {
					this.scrollValue = null;
				}
			}
		},
		computed : {
			showFooter : function () {
				return !(this.hideFooter != null && (this.hideFooter === true || this.hideFooter === 'true'));
			},
			finalWidth : function () {
				return this.visible ? this.width : '50px!important';
			},
			isLeft     : function () {
				return this.type == null || this.type === 'left';
			},
			isBody     : function () {
				return this.type === 'body';
			},
			isRight    : function () {
				return this.type === 'right';
			},
			isFooter   : function () {
				return this.$scopedSlots['footer'] !== undefined && this.showFooter;
			},
			isButtons  : function () {
				return this.$scopedSlots['buttons'] !== undefined;
			}
		}
	}
});