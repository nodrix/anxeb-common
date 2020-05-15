'use strict';

anxeb.vue.include.component('field-categories', function (helpers) {
	let $allowBranchesWatch = false;
	return {
		template     : '/controls/field-categories.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'type', 'value', 'single', 'direction', 'return-lineage', 'alt-fields'],
		mounted      : function () {
			let _self = this;
			_self.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression) : null;

			$(document).bind('mouseup.' + _self.name, function (e) {
				let box = $(_self.$refs.box);
				let button = $(_self.$refs.browseButton);
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});
		},
		destroyed    : function () {
			$(document).unbind('mouseup.' + this.name);
		},
		created      : function () {
			let _self = this;
			this.init(function () {
				_self.normalizeInput();
			});
		},
		data         : function () {
			return {
				name         : null,
				branches     : null,
				selected     : null,
				canBrowse    : false,
				singleBranch : null
			}
		},
		methods      : {
			clear           : function () {
				let _self = this;
				_self.uniselect(null);
				if (_self.isSingle) {
					_self.$emit('input', null);
				} else {
					_self.$emit('input', []);
				}
				_self.reset();
			},
			reload          : function () {
				let _self = this;
				this.init(function () {
					_self.normalizeInput();
				});
			},
			init            : function (callback) {
				let _self = this;
				_self.branches = [];
				_self.$root.page.busy();
				helpers.api.get('/references', { params : { type : _self.type, childs : 'count' } }).then(function (res) {
					_self.$root.page.idle();

					res.data.iterate((reference) => {
						let branch = {
							root  : reference,
							value : null,
							count : reference.childs
						};
						_self.branches.push(branch);
					});

					if (callback) {
						callback();
					}

					$allowBranchesWatch = true;
				}).catch(function (err) {
					_self.$root.log(err).exception();
				});
			},
			normalizeOutput : function () {
				let _self = this;
				let result = [];

				_self.branches.iterate((branch) => {
					if (_self.isLineage) {
						let keys = {};
						let reference = branch.value;
						while (reference != null) {
							keys[reference.type] = {
								id     : reference.id,
								name   : reference.name,
								type   : reference.type,
								meta   : reference.meta || {},
								parent : reference.parent && reference.parent.id ? reference.parent.id : null
							};
							reference = reference.parent;
						}
						result.push(keys);
					} else {
						result.push({
							root  : { id : branch.root.id, name : branch.root.name, type : branch.root.type, meta : branch.root.meta },
							value : { id : branch.value.id, name : branch.value.name, type : branch.value.type, meta : branch.value.meta },
						});
					}
				}, (branch) => branch != null && branch.value != null);

				if (_self.isSingle) {
					_self.$emit('input', result.length > 0 ? result[0] : null);
				} else {
					_self.$emit('input', result);
				}
			},
			getLineage      : function (keys) {
				let _self = this;
				let result = {};

				if (_self.isLineage) {
					let items = [];

					[keys].atomize((item) => {
						items.push(helpers.tools.data.copy(item));
					}, (item) => item != null && typeof item === 'object' && item['name'] != null && item['type'] != null);

					result.root = items.filter(function (item) {
						return item.parent == null;
					})[0] || null;

					items.iterate((oitem) => {
						let ochilds = items.filter(function (item) {
							return oitem.id === item.parent;
						});
						if (ochilds.length > 0) {
							oitem.child = ochilds[0];
						} else {
							result.value = oitem;
							oitem.child = null;
						}
					});
				}
				return result;
			},
			normalizeInput  : function () {
				let _self = this;

				let values = _self.value;

				if (values == null || values.length === 0) {
					_self.uniselect(null);
					_self.reset();
					return;
				}

				if (_self.isLineage) {
					let retrieveMainValue = function (keys) {
						let lineage = _self.getLineage(keys);

						return {
							root  : lineage.root,
							value : lineage.value
						};
					};

					if (_self.isSingle) {
						values = retrieveMainValue(values);
					} else {
						values = values.map(function (value) {
							return retrieveMainValue(value);
						})
					}
				}

				if (values != null) {
					_self.branches.iterate((branch) => {
						if (_self.isSingle) {
							if (values.root != null && values.root.id === branch.root.id) {
								branch.value = values.value;
							} else {
								branch.value = null;
							}
						} else {
							values.iterate((item) => {
								if (item != null && item.root.id === branch.root.id) {
									branch.value = item.value;
								}
							});
						}
					});
				}
			},
			browse          : function () {
				let _self = this;

				let toggle = function () {
					_self.canBrowse = !_self.canBrowse;
					if (!_self.canBrowse) {
						_self.reset();
					}
				};

				if (_self.branches == null) {
					_self.init(function () {
						_self.normalizeInput();
						toggle();
					});
				} else {
					toggle();
				}
			},
			reset           : function () {
				this.canBrowse = false;
				this.selected = null;
			},
			remove          : function (branch) {
				branch.value = null;
				this.normalizeOutput();
			},
			select          : function (reference) {
				if (this.selected === reference) {
					this.selected = null;
				} else {
					this.selected = reference;
				}
			},
			uniselect       : function (item) {
				let _self = this;
				_self.branches.iterate((branch) => {
					if (item != null && branch.root.id === item.root.id) {
						branch.value = item.value;
					} else {
						branch.value = null;
					}
				});
			},
			onSelected      : function (branch) {
				let _self = this;

				if (_self.isSingle) {
					_self.uniselect(branch);
					_self.canBrowse = false;
					_self.selected = null;
				}

				_self.normalizeOutput();
			}
		},
		computed     : {
			previewTitle       : function () {
				let _self = this;
				let branch = _self.selectedBranch;
				if (branch != null) {

					if (_self.isLineage) {
						let title = '';
						let lineage = null;

						if (_self.isSingle) {
							lineage = _self.getLineage(_self.value);

							let refe = lineage.root;
							while (refe != null) {
								title += refe.name;
								if (refe.child != null) {
									title += ' / ';
								}
								refe = refe.child;
							}
						}

						return title;
					} else {
						return branch.root.name + ' : ' + branch.value.name;
					}
				}
				return '';
			},
			isLineage          : function () {
				return this.returnLineage === 'true' || this.returnLineage === true;
			},
			selectedBranch     : function () {
				return this.branches.iterate((branch) => {
					if (branch.value != null) {
						return branch;
					}
				}) || null;
			},
			isSingle           : function () {
				return this.single === true || this.single === 'true';
			},
			anyValue           : function () {
				let _self = this;
				if (_self.value != null) {
					if (_self.isSingle) {
						return true;
					} else {
						return _self.value.length > 0;
					}
				} else {
					return false;
				}
			},
			availableSelection : function () {
				return this.branches.iterate((branch) => {
					if (branch.count > 0) {
						return true;
					}
				}) || false;
			}
		},
		watch        : {
			value : function (value) {
				this.normalizeInput();
			}
		}
	};
});