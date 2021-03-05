'use strict';

anxeb.vue.include.component('category-node', function (helpers) {
	return {
		template     : '/components/category-node.vue',
		inheritAttrs : false,
		props        : ['value', 'api', 'item', 'level', 'offset', 'controller', 'list-name'],
		inject       : ['page', 'log', 'modal', 'dialogs'],
		mounted      : function () {
			this.prepare();
		},
		updated() {
			this.prepare();
		},
		created      : function () {
			this.normalizeSelection();
		},
		methods      : {
			expand             : async function (lineage) {
				let _self = this;
				await _self.toggle(true);
				let item = lineage.shift();
				_self.$forceUpdate();

				if (item) {
					let node = _self.$refs[`node_${item.id}`];
					if (node && node instanceof Array) {
						await node[0].expand(lineage);
					}
				}
			},
			select             : function () {
				let _self = this;
				if (_self.controller && _self.item.$deleted !== true) {
					_self.controller.selected = _self.item;
				}
			},
			toggle             : async function (value) {
				let _self = this;
				if (_self.busy === true) {
					return;
				}
				if (value != null) {
					_self.expanded = value;
				} else {
					_self.expanded = !_self.expanded;
				}

				if (_self.expanded && _self.items == null) {
					await _self.refresh();
				}
			},
			refresh            : async function (params) {
				let _self = this;
				_self.busy = true;
				try {
					let res = await helpers.api.get(_self.api, { params : { parent : _self.item.id } });
					_self.items = _self.prepareList(res.data);
				} catch (err) {
					_self.err = err;
				} finally {
					_self.busy = false;
				}
			},
			onChildRemoved     : function (removedItem) {
				let _self = this;
				_self.items = _self.items.filter((item) => item.id !== removedItem.id);
			},
			prepareList        : function (items) {
				let _self = this;
				return items.map(function (item) {
					item.refresh = _self.selfRefresh;
					item.remove = _self.selfRemove;
					item.update = _self.selfUpdate;
					return item;
				});
			},
			prepare            : function (data) {
				let _self = this;
				_self.item.refresh = _self.selfRefresh;
				_self.item.remove = _self.selfRemove;
				_self.item.update = _self.selfUpdate;
				_self.item.update(data);
			},
			selfUpdate         : function (values) {
				let _self = this;
				if (values) {
					for (let k in values) {
						if (_self.item[k] != null) {
							_self.item[k] = values[k];
						}
					}
				}
			},
			selfRemove         : function () {
				let _self = this;
				_self.item.$deleted = true;
				if (_self.item === _self.controller.selected) {
					_self.controller.selected = null;
				}
				_self.$emit('remove', _self.item);
			},
			selfRefresh        : async function (params) {
				let _self = this;
				_self.busy = true;
				try {
					if (params && (params.list || params.full)) {
						let res = await helpers.api.get(_self.api, { params : { parent : _self.item.id } });
						_self.items = _self.prepareList(res.data);
					}

					if (params && params.full) {
						let res = await helpers.api.get(_self.api, { params : { lineage : _self.item.id } });
						_self.prepare(res.data);
					}

					if (params && params.expand) {
						_self.expanded = true;
					}
				} catch (err) {
					_self.err = err;
				} finally {
					_self.busy = false;
				}
			},
			normalizeSelection : function () {
				if (this.controller.selected != null && this.item != null && this.item !== this.controller.selected && this.item.id === this.controller.selected.id) {
					this.controller.selected = this.item;
				}
			},
			onContextMenu      : function (e) {
				if (this.$refs.actions != null) {
					this.$refs.actions.contextmenu(e);
				}
			}
		},
		watch        : {
			'controller.selected' : function (item) {
				if (this.item.$deleted !== true) {
					this.normalizeSelection();
				}
			}
		},
		computed     : {
			levelWidth  : function () {
				let total = (this.level || 0) * (this.offset || 15);
				return `${total}px`;
			},
			$controller : function () {
				return this.controller || this.defaultController;
			}
		},
		data         : function () {
			let _self = this;
			return {
				expanded : false,
				busy     : false,
				err      : null,
				items    : null
			}
		}
	};
});