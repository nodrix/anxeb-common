'use strict';

anxeb.vue.include.component('grid', {
	vendors  : ['styles/grid.css'],
	includes : ['controls/field-select', 'controls/field-input'],
	props    : ['source', 'paging', 'filter', 'list-type', 'empty-options', 'show-paging', 'page-change', 'cpage', 'empty-offset', 'paging-options'],
	created  : function () {
		this.$paging = this.paging || 7;
		if (this.source != null) {
			this.data = this.source.slice();
		}
	},
	watch    : {
		source : function () {
			if (this.source != null) {
				this.data = this.source.slice();
				this.refresh();
			} else {
				this.data = [];
			}
		},
		page   : function () {
			if (this.pageChange) {
				this.pageChange(this.page);
			}
		}
	},
	mounted  : function () {
		if (this.cpage != null) {
			this.page = this.cpage;
		}
		this.refresh();
	},
	computed : {
		type    : function () {
			return this.listType;
		},
		from    : function () {
			return this.page * this.$paging;
		},
		to      : function () {
			return this.from + this.$paging;
		},
		rows    : function () {
			let _self = this;
			if (_self.$sorter) {
				return _self.data.sort(function (a, b) {
					if (_self.$sorter(a) < _self.$sorter(b)) {
						return _self.$sorterDesc;
					}
					if (_self.$sorter(a) > _self.$sorter(b)) {
						return _self.$sorterAsc;
					}
					return 0;
				}).slice(_self.from, _self.to);
			} else {
				return _self.data.slice(_self.from, _self.to);
			}
		},
		visible : function () {
			return 0
		},
		pages   : function () {
			if (this.data.length >= this.$paging) {
				return Math.ceil(this.data.length / this.$paging);
			} else {
				return 1;
			}
		},
		total   : function () {
			return this.pages - 1;
		},
		current : function () {
			return this.page + 1;
		}
	},
	methods  : {
		exists  : function (slot) {
			return this.$scopedSlots[slot] !== undefined;
		},
		sort    : function (field) {
			if (this.$sorterDesc === -1) {
				this.$sorterDesc = 1;
				this.$sorterAsc = -1;
			} else {
				this.$sorterDesc = -1;
				this.$sorterAsc = 1;
			}

			let parts = field.split('.');
			if (parts.length > 1) {
				this.$sorter = function (item) {
					let obj = item[parts[0]];
					if (obj != null) {
						return obj[parts[1]];
					} else {
						return null;
					}
				};
			} else {
				this.$sorter = function (item) {
					return item[parts[0]];
				};
			}
			this.page++;
			this.page--;
		},
		refresh : function () {
			if (this.source != null) {
				if (this.filter) {
					this.data = this.source.filter(row => this.filter(row));
				} else {
					this.data = this.source.slice();
				}
			}
			if (this.page >= this.pages) {
				this.page = this.pages - 1;
			}
		},
		unsort  : function () {
			this.$sorter = null;
		},
		next    : function () {
			if (this.page < this.total) {
				this.page++;
			}
		},
		prev    : function () {
			if (this.page > 0) {
				this.page--;
			}
		},
		first   : function () {
			this.page = 0;
		},
		last    : function () {
			this.page = this.total;
		}
	},
	data     : function () {
		return {
			slots : {},
			data  : [],
			page  : 0
		};
	},
	template : '/components/grid.vue'
});