'use strict';

anxeb.vue.include.component('top-stats', function (helpers) {

	return {
		template      : '/components/top-stats.vue',
		created       : function () {
			this.interval = setInterval(() => {
				this.currentDate = moment();
				this.blink = !this.blink;
			}, 1000);
		},
		beforeDestroy : function () {
			clearInterval(this.interval);
		},
		computed      : {
			dateText : function () {
				return this.currentDate.format('dddd LL');
			},
			timeText : function () {
				return this.currentDate.format('h' + (this.blink ? ':' : ' ') + 'mm');
			},
			aText    : function () {
				return this.currentDate.format('A');
			}
		},
		data          : function () {
			return {
				blink       : false,
				interval    : null,
				currentDate : moment()
			}
		}
	}
});