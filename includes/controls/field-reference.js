'use strict';

anxeb.vue.include.component('field-reference', function (helpers) {


	let ReferencesPage = function (params) {
		let _self = this;
		_self.next = null;
		_self.prev = params != null ? params.prev : null;

		_self.parent = params != null ? params.parent : null;
		_self.type = params != null ? params.type : null;
		_self.references = null;
		_self.selected = null;
		_self.caption = params != null ? params.caption : null;

		_self.init = async function () {
			_self.reset();
			await _self.fetch();
		}

		_self.isSelected = function (id) {
			return _self.selected != null && _self.selected.id === id;
		}

		_self.reset = function () {
			_self.references = null;
			_self.next = null;
			_self.selected = null;
		}

		_self.select = async function (reference) {
			_self.selected = reference;
			if (reference.childs > 0) {
				let page = new ReferencesPage({ parent : reference, prev : this });
				await page.fetch();
				_self.next = page
			}
		}

		_self.fetch = async function () {
			let _self = this;

			if (_self.parent) {
				let res = await helpers.api.get('/references/' + _self.parent.id, { params : { childs : 'all' } });
				_self.references = [];
				_self.caption = _self.parent.name;
				res.data.childs.iterate((reference) => {
					_self.references.push(reference);
				});
			} else {
				let res = await helpers.api.get('/references', { params : { type : _self.type, childs : 'count' } });
				_self.references = [];

				res.data.iterate((reference) => {
					if (reference.childs > 0) {
						_self.references.push(reference);
					}
				});
			}
		};
	}

	return {
		template     : '/controls/field-reference.vue',
		inheritAttrs : false,
		inject       : ['page', 'log', 'modal'],
		props        : ['label', 'id', 'readonly', 'type', 'value', 'direction', 'mode', 'root-model-name', 'mapping', 'root-caption', 'minimal', 'alt-fields'],
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
			_self.loadBranches(_self.value);
		},
		methods      : {
			prevPage     : function () {
				this.current = this.current.prev;
			},
			nextPage     : function () {
				this.current = this.current.next;
			},
			refresh      : async function () {
				let _self = this;
				_self.setBusy();
				try {
					_self.page = new ReferencesPage({ type : _self.type, caption : _self.rootCaption });
					_self.current = _self.page;
					await _self.page.init();
				} catch (err) {
					_self.log(err).exception();
				} finally {
					_self.setIdle();
				}
			},
			isSelected   : function (referenceId) {
				let _self = this;
				return _self.current.isSelected(referenceId) || _self.branches.some((item) => (item.root != null && item.root.id === referenceId) || item.id === referenceId);
			},
			loadBranches : async function (value) {
				let _self = this;
				if (value == null) {
					_self.branches = [];
				} else {
					let $references = [];
					if (_self.isSingle) {
						$references = [value];
					} else if (_self.isMulti) {
						$references = value || []
					} else if (_self.isLineage) {
						let keys = Object.keys(value);
						let available = Object.keys(_self.mapping).map((key) => _self.mapping[key]);
						$references = keys.filter((key) => available.includes(key)).map((key) => value[key]);
					}
					if ($references.length > 0) {
						_self.setBusy();
						try {
							let res = await helpers.api.get('/references', { params : { branches : $references } });
							_self.branches = res.data;
						} catch (err) {
							_self.branches = [];
							_self.log(err).exception();
						} finally {
							_self.setIdle();
						}
					} else {
						_self.branches = [];
					}
				}
			},
			clear        : function () {
				let _self = this;
				let $value = null;
				if (_self.isMulti) {
					$value = [];
				}
				_self.branches = [];
				_self.$emit('input', $value);
				_self.$emit('changed', null);
				_self.reset();
			},
			select       : async function (reference) {
				let _self = this;
				_self.setBusy(reference);
				try {
					if (reference.childs === 0) {
						let $value = _self.value;

						if (_self.isSingle) {
							$value = reference.id;
						} else if (_self.isMulti) {
							$value = $value || [];
							if (!$value.includes(reference.id)) {
								$value.push(reference.id);
							}
						} else if (_self.isLineage) {
							let result = {};
							let $page = _self.page;
							while ($page != null && $page.selected != null) {
								result[_self.mapping[$page.selected.type]] = $page.selected.id;
								$page = $page.next;
							}
							result[_self.mapping[reference.type]] = reference.id;
							$value = helpers.tools.data.copy(result);
						}
						_self.$emit('input', $value);
						_self.$emit('changed', reference);
						_self.canBrowse = false;
					} else {
						await _self.current.select(reference);
						_self.current = _self.lastPage;
					}
				} catch (err) {
					_self.log(err).exception();
				} finally {
					_self.setIdle();
				}
			},
			remove       : function (branch) {
				let _self = this;
				for (let i = 0; i < _self.value.length; i++) {
					if (_self.value[i] === branch.id) {
						_self.value.splice(i, 1);
						break;
					}
				}
				for (let i = 0; i < _self.branches.length; i++) {
					if (_self.branches[i].id === branch.id) {
						_self.branches.splice(i, 1);
						break;
					}
				}
			},
			reset        : function () {
				this.canBrowse = false;
			},
			setIdle      : function () {
				let _self = this;
				_self.busy.fetching = false;
				_self.busy.display = false;
				_self.busy.reference = null;
			},
			setBusy      : function (reference) {
				let _self = this;
				_self.busy.reference = reference;
				_self.busy.fetching = true;
				setTimeout(function () {
					if (_self.busy.fetching) {
						_self.busy.display = true;
					}
				}, 80);
			},
			browse       : async function () {
				let _self = this;

				if (_self.busy.fetching) {
					return;
				}

				let toggle = function () {
					_self.canBrowse = !_self.canBrowse;
					if (!_self.canBrowse) {
						_self.reset();
					}
				};

				if (_self.page == null) {
					await _self.refresh();
					toggle();
				} else {
					await _self.refresh();//TODO REMOVE
					toggle();
				}
			},
			getLineage   : function (params) {
				let _self = this;
				let $page = _self.page;
				let result = [];
				let max = params != null ? params.max : null;

				while ($page != null && $page.selected != null) {
					result.push($page.selected);
					$page = $page.next;
				}

				if (max != null && result.length - max > 0) {
					let limited = [];
					for (let i = result.length - max; i < result.length; i++) {
						limited.push(result[i]);
					}
					return limited;
				}

				return result;
			},
		},
		computed     : {
			isSingle         : function () {
				return this.mode === 'single';
			},
			isLineage        : function () {
				return this.mode === 'lineage';
			},
			isMulti          : function () {
				return this.mode === 'multi';
			},
			isMinimal        : function () {
				return this.minimal === 'true' || this.minimal === true;
			},
			caption          : function () {
				let _self = this;
				if (_self.branches != null && _self.branches.length > 0) {
					if (_self.isSingle) {
						let $reference = _self.branches[0];
						return (!_self.isMinimal && $reference.root ? ($reference.root.name + ' : ') : '') + $reference.name;
					} else if (_self.isMulti) {
						return _self.branches.map((item) => (!_self.isMinimal && item.root ? (item.root.name + ':') : '') + item.name).join(' / ');
					} else if (_self.isLineage) {
						return _self.branches.map((item) => item.name).join(' / ');
					}
				} else {
					return null;
				}
			},
			anyValue         : function () {
				let _self = this;
				return _self.branches != null && _self.branches.length > 0;
			},
			lastPage         : function () {
				let _self = this;
				let $page = _self.page;
				while ($page != null) {
					if ($page.next == null) {
						break;
					}
					$page = $page.next;
				}
				return $page;
			},
			selectionCaption : function () {
				let _self = this;
				let references = _self.getLineage({ max : 3 });

				if (references.length === 0) {
					return _self.rootCaption || _self.label;
				} else {
					return references.map((item) => item.name).join(' / ');
				}
			},
			pageCaption      : function () {
				return (this.current != null ? this.current.caption : null) || this.rootCaption || this.label;
			}
		},
		watch        : {
			value : function (value) {
				this.loadBranches(value);
			}
		},
		data         : function () {
			return {
				name      : null,
				page      : null,
				current   : null,
				canBrowse : false,
				branches  : [],
				busy      : {
					fetching : false,
					display  : false
				}
			}
		},
	};
});