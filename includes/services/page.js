'use strict';

anxeb.vue.include.service('page', function (helpers) {
	let _self = this;
	let _busy;
	_self.meta = {};
	_self.key = null;

	_self.navigate = function (path, query, params) {
		_self.meta = {};
		_self.key = null;
		if (params || query) {
			helpers.root.router.push({ path : path, params : params, query : query });
		} else {
			helpers.root.router.push(path);
		}
	};

	_self.menu = {
		remove : function (key) {
			setTimeout(function () {
				helpers.root.$fetch('top-menu').then(function (topMenu) {
					topMenu.remove(key);
					topMenu.refresh();
				}).catch(function () {});
			}, 0);
		},
		add    : function (group, pages) {
			setTimeout(function () {
				helpers.root.$fetch('top-menu').then(function (topMenu) {
					topMenu.add(group, pages);
					topMenu.refresh();
				}).catch(function () {});
			}, 0);
		},
		clear  : function () {
			setTimeout(function () {
				helpers.root.$fetch('top-menu').then(function (topMenu) {
					topMenu.clear();
				}).catch(function () {});
			}, 0);
		},
		append : function (groupKey, page) {
			setTimeout(function () {
				helpers.root.$fetch('top-menu').then(function (topMenu) {
					let group = topMenu.append(groupKey, page);
					if (group && callback) {
						callback(group);
					}
				}).catch(function () {});
			}, 0);
		},
		update : function (key, callback) {
			setTimeout(function () {
				helpers.root.$fetch('top-menu').then(function (topMenu) {
					let group = topMenu.getGroup(key);
					if (group && callback) {
						callback(group);
					}
				}).catch(function () {});
			}, 0);
		}
	};

	_self.busy = function () {
		_busy = true;
		setTimeout(function () {
			if (_busy) {
				helpers.root.flags.busy = true;
			}
		}, 200);
	};

	_self.idle = function () {
		_busy = false;
		helpers.root.flags.busy = false;
	};

	_self.title = function (title) {
		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.title = title;
		}).catch(function () {});
	};

	_self.action = function (action) {
		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.action = action;
		}).catch(function () {});
	};

	_self.subtitle = function (subtitle) {
		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.subtitle = subtitle;
		}).catch(function () {});
	};

	_self.setup = function (params) {
		_self.menu.clear();
		_self.meta = params.meta || {};
		_self.key = params.key || null;

		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.setup(params);
		}).catch(function () {});
	};

	_self.reset = function (params) {
		_self.menu.clear();
		_self.meta = {};
		_self.key = null;
	};

	_self.subpage = function (params) {
		if (params.meta) {
			_self.meta = params.meta;
		}
		if (params.key) {
			_self.key = params.key;
		}

		helpers.root.$fetch('top-header').then(function (topHeader) {
			topHeader.subpage(params);
		}).catch(function () {});
	};

	_self.setHint = function (item) {
		helpers.root.$broadcast('status-bar', function (statusBar) {
			statusBar.setHint(item);
		});
	};

});