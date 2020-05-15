'use strict';

anxeb.vue.include.component('top-menu', function (helpers) {

	let Icon = function (params) {
		let _self = this;

		if (typeof params === 'string') {
			_self.class = params;
			_self.color = null;
		} else {
			_self.class = params.class || null;
			_self.color = params.color || null;
			_self.image = params.image || null;
			_self.alt = params.alt || null;
		}
	};

	let Caption = function (params) {
		let _self = this;

		if (typeof params === 'string') {
			_self.title = params;
			_self.color = null;
		} else {
			_self.title = params.title || null;
			_self.subtitle = params.subtitle || null;
			_self.color = params.color || null;
		}
	};

	let Label = function (params) {
		let _self = this;

		if (typeof params === 'string') {
			_self.text = params;
			_self.color = null;
			_self.fill = null;
			_self.enabled = false;
		} else {
			_self.text = params.text || null;
			_self.color = params.color || null;
			_self.fill = params.fill || null;
			_self.enabled = params.enabled || null;
		}
	};

	let Group = function (params, pages) {
		let _self = this;

		_self.refresh = function (path, route) {
			if (_self.isActive) {
				_self.active = _self.isActive(path, route);
			} else {
				_self.active = _self.path === path;
				if (_self.pages) {
					for (let i = 0; i < _self.pages.length; i++) {
						let page = _self.pages[i];
						if (page.refresh(path, route) === true) {
							_self.active = true;
							break;
						}
					}
				}
			}
			return _self.active;
		};

		_self.update = function (params, pages) {
			_self.key = params.key || null;
			_self.active = params.active != null ? params.active : null;
			_self.visible = params.visible != null ? params.visible : null;
			_self.caption = params.caption ? new Caption(params.caption) : null;
			_self.label = params.label ? new Label(params.label) : null;
			_self.icon = params.icon ? new Icon(params.icon) : null;
			_self.hint = params.hint || null;
			_self.action = params.action || null;
			_self.path = params.path || null;
			_self.isActive = params.isActive || null;
			_self.isDisabled = params.isDisabled || null;
			_self.isVisible = params.isVisible || null;
			_self.role = params.role || null;
			_self.options = params.options || null;
			_self.index = params.index || null;
			_self.mobile = params.mobile != null ? params.mobile : null;
			_self.pages = [];

			if (pages) {
				for (let i = 0; i < pages.length; i++) {
					_self.pages.push(new Page(pages[i]));
				}
			}
		};

		_self.add = function (params) {
			let page = null;

			if (params != null && params.key == null && params.caption != null) {
				params.key = params.caption.replace(' ', '_').toLowerCase();
			}

			if (params != null && params.key != null) {
				page = _self.pages.filter(function (item) {
					return item.key === params.key;
				})[0];
			}

			if (page == null) {
				page = new Page(params);
				_self.pages.push(page);
			} else {
				page.update(params);
			}

			return params;
		};

		_self.update(params, pages);
	};

	let Page = function (params) {
		let _self = this;

		_self.refresh = function (path, route) {
			if (_self.isActive) {
				_self.active = _self.isActive(path, route);
			} else {
				_self.active = _self.path === path;
			}
			return _self.active;
		};

		_self.update = function (params) {
			_self.key = params.key || null;
			_self.active = params.active != null ? params.active : null;
			_self.visible = params.visible != null ? params.visible : null;
			_self.caption = params.caption ? new Caption(params.caption) : null;
			_self.label = params.label ? new Label(params.label) : null;
			_self.hint = params.hint || null;
			_self.icon = params.icon ? new Icon(params.icon) : null;
			_self.path = params.path || null;
			_self.action = params.action || null;
			_self.isActive = params.isActive || null;
			_self.isDisabled = params.isDisabled || null;
			_self.isVisible = params.isVisible || null;
			_self.role = params.role || null;
			_self.divider = params.divider || false;
			_self.options = params.options || null;
		};

		_self.update(params);
	};

	return {
		template : '/components/top-menu.vue',
		props    : ['mobile-max'],
		inject   : ['session', 'page'],
		created  : function () {
			let _self = this;

			this.$router.afterEach(function (to, from) {
				_self.refresh();
			});

			$(window).resize(function () {
				_self.screen.width = $(window).width();
			});
		},
		computed : {
			sortedGroups : function () {
				return this.groups.sort(function (a, b) {
					return (a.index || 0) - (b.index || 0);
				});
			}
		},
		methods  : {
			clear    : function () {
				this.groups = [];
			},
			append   : function (groupkey, page) {
				let group = this.groups.filter(function (item) {
					return item.key === groupkey;
				})[0];

				if (group != null) {
					group.add(page);
				}

				return group;
			},
			add      : function (groupParams, pages) {
				let group = null;

				if (groupParams != null && groupParams.key == null && groupParams.caption != null) {
					groupParams.key = groupParams.caption.replace(' ', '_').toLowerCase();
				}

				if (groupParams.key != null) {
					group = this.groups.filter(function (item) {
						return item.key === groupParams.key;
					})[0];
				}

				if (group == null) {
					group = new Group(groupParams, pages);
					this.groups.push(group);
				} else {
					group.update(groupParams, pages);
				}

				return group;
			},
			refresh  : function () {
				let _self = this;

				for (let g = 0; g < _self.groups.length; g++) {
					_self.groups[g].refresh(_self.$router.currentRoute.path, _self.$router.currentRoute);
				}
			},
			getGroup : function (key) {
				let _self = this;
				for (let g = 0; g < _self.groups.length; g++) {
					let group = _self.groups[g];
					if (group.key === key) {
						return group;
					}
				}
			}
		},
		data     : function () {
			return {
				screen : {
					width : $(window).width()
				},
				groups : []
			}
		}
	}
});