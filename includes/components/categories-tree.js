'use strict';

anxeb.vue.include.component('categories-tree', function (helpers) {
	return {
		props    : ['value', 'context-menu', 'api'],
		inject   : ['page', 'log', 'modal', 'dialogs'],
		template : '/components/categories-tree.vue',
		created  : function () {
			this.refresh();
		},
		mounted  : function () { },
		methods  : {
			onRootRemoved  : function (item) {
				let _self = this;
				_self.categories = _self.categories.filter(($item) => $item.id !== item.id);
			},
			onSelected     : function (item) {
				this.$emit('select', item);
				this.$emit('input', this.tree.selected ? this.tree.selected.id : null);
			},
			add            : function () {
				this.$emit('add');
			},
			refresh        : async function (params) {
				let _self = this;
				let refreshSelected = params != null && params.selected === true;

				if (refreshSelected === true && _self.tree.selected != null) {
					_self.tree.selected.refresh({
						expand : true,
						full   : true
					});
					return;
				}

				_self.page.busy();
				try {
					let res = await helpers.api.get(_self.api.get)
					_self.categories = res.data.map(function (item) {
						return item;
					});

					_self.$forceUpdate();

					if (_self.tree.selected == null) {
						await _self.refreshLineage();
					}

					if (params && params.silent !== true) {
						_self.log('Lista recargada correctamente').information();
					} else {
						_self.page.idle();
					}
				} catch (err) {
					_self.log(err).exception();
				}
			},
			refreshLineage : async function () {
				let _self = this;
				if (_self.value != null) {
					let res = await helpers.api.get(_self.api.get, { params : { lineage : _self.value } });
					if (res.data && res.data.id) {
						_self.tree.selected = res.data;

						let $parent = _self.tree.selected;
						let lineage = [];

						while ($parent != null) {
							lineage.unshift($parent);
							$parent = $parent.parent;
						}

						let item = lineage.shift();
						if (item) {
							let node;
							let i = 0;
							while (!node && i < 100) {
								i++;
								node = _self.$refs[`node_${item.id}`];
								await anxeb.vue.helpers.tools.delay(1);
							}
							if (node && node instanceof Array) {
								await node[0].expand(lineage);
							}
						}
						return _self.tree.selected;
					}
				}
			}
		},
		watch    : {
			value : function (value) {
				if (value == null) {
					this.tree.selected = null
				}
			}
		},
		computed : {
			selected : function () {
				return this.tree.selected;
			}
		},
		data     : function () {
			return {
				categories : null,
				tree       : {
					selected : null
				}
			}
		},

	}
});