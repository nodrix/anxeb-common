'use strict';

anxeb.vue.include.component('data-table', function (helpers) {

	return {
		props    : ['source', 'paging', 'list-type', 'empty-options', 'show-paging', 'page-change', 'state', 'empty-offset', 'filters'],
		created  : function () {
			this.$limit = this.paging || 7;
		},
		watch    : {
			source  : function () {
				if (this.source != null) {
					this.refresh();
				} else {
					this.$data = [];
				}
			},
			page    : function () {
				if (this.pageChange) {
					this.pageChange(this.page);
				}
				this.refresh();
			},
			filters : {
				handler : function () {
					this.refresh();
				},
				deep    : true
			}
		},
		mounted  : function () {
			if (this.state != null && this.state.page != null) {
				this.page = this.state.page || this.page;
			}
			this.refresh();
		},
		computed : {
			type    : function () {
				return this.listType;
			},
			from    : function () {
				return this.page * this.$limit;
			},
			to      : function () {
				return this.from + this.$limit;
			},
			visible : function () {
				return 0
			},
			pages   : function () {
				let _self = this;
				if (_self.count != null && _self.count >= _self.$limit) {
					return Math.ceil(_self.count / _self.$limit);
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
				if (this.$sorter === field) {
					this.$desc = !this.$desc;
				} else {
					this.$desc = false;
				}
				this.$sorter = field;
				this.refresh();
			},
			unsort  : function () {
				this.$sorter = null;
				this.refresh();
			},
			refresh : function (callback) {
				let _self = this;
				if (this.source != null) {
					let prefix = _self.source.endsWith('&') || _self.source.endsWith('?') ? '' : '?';
					let sortField = _self.$sorter ? ('&sort=' + _self.$sorter) : '';
					let sortDirection = _self.$desc === true ? '&desc=true' : '';
					let queryParams = '';

					_self.filtered = false;
					if (_self.filters != null) {
						for (let key in _self.filters) {
							let value = _self.filters[key];
							if (value != null && value.length > 0) {
								queryParams += '&' + key + '=' + value;
								_self.filtered = true;
							}
						}
					}

					_self.$root.page.busy();
					helpers.api.get(_self.source + prefix + 'page=' + _self.current + '&limit=' + _self.$limit + sortField + sortDirection + queryParams).then(function (res) {
						_self.rows = res.data;
						_self.count = parseInt(res.headers['table-row-count']);

						if (_self.page >= _self.pages) {
							_self.page = _self.pages - 1;
						}

						_self.$root.page.idle();
						if (callback) {
							callback({
								rows  : _self.rows,
								count : _self.count
							});
						}
					}).catch(function (err) {
						_self.$root.log(err).exception();
					});
				} else {
					_self.rows = [];
				}
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
				slots    : {},
				rows     : null,
				count    : null,
				page     : 0,
				filtered : false
			};
		},
		template : '/components/data-table.vue'
	};
});