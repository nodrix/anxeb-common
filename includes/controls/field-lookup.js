'use strict';

anxeb.vue.include.component('field-lookup', function (helpers) {

	return {
		template     : '/controls/field-lookup.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'value', 'direction', 'source', 'binding', 'create-settings', 'preload', 'allow-create', 'default-text'],
		mounted      : function () {
			let _self = this;
			this.name = _self.$vnode.data.model != null ? (_self.$vnode.data.model.expression) : null;

			let box = $(_self.$refs.box);
			let button = $(_self.$refs.browseButton);

			$(document).mouseup(function (e) {
				if (button.is(e.target) || button.has(e.target).length > 0 || box.is(e.target) || box.has(e.target).length > 0) {
					//nothig
				} else {
					_self.reset();
				}
			});

			_self.reset();
			_self.updatePreview({
				mounting : true
			});
		},
		data         : function () {
			return {
				name          : null,
				presearch     : null,
				loaded        : false,
				canBrowse     : false,
				result        : null,
				search        : null,
				canSearchTick : 0,
				selected      : null,
				preview       : null,
				busy          : {
					searching : false,
					display   : false
				}
			}
		},
		computed     : {
			isReadOnly  : function () {
				return this.readonly === 'true' || this.readonly === true;
			},
			notReadOnly : function () {
				return !this.isReadOnly;
			},
			anyValue    : function () {
				let _self = this;
				return _self.value != null && _self.preview != null;
			},
			canCreate   : function () {
				return this.allowCreate === 'true' || this.allowCreate === true;
			}
		},
		methods      : {
			createItem    : function () {
				let _self = this;
				if (_self.presearch && _self.presearch.length > 0) {
					_self.$emit('create', _self.presearch);
				}
			},
			updatePreview : function (params) {
				let _self = this;
				if (_self.source && _self.source.item && _self.value != null) {
					if (typeof _self.value === 'string') {
						_self.setBusy();
						helpers.api.get(_self.source.item + '/' + _self.value).then(function (res) {
							_self.preview = res.data;
							_self.loaded = true;
							if (!params || params.mounting !== true) {
								_self.$emit('change', _self.preview);
							}
							_self.selected = null;
							_self.setIdle();
						}).catch(function (err) {
							_self.setIdle();
							_self.$root.log(err).exception();
							_self.loaded = true;
						});
					} else {
						_self.preview = _self.value;
						_self.loaded = true;
						if (!params || params.mounting !== true) {
							_self.$emit('change', _self.preview);
						}
						_self.selected = null;
					}
				} else {
					_self.loaded = true;
				}
			},
			setIdle       : function () {
				let _self = this;
				_self.busy.searching = false;
				_self.busy.display = false;
			},
			setBusy       : function () {
				let _self = this;
				_self.busy.searching = true;
				setTimeout(function () {
					if (_self.busy.searching) {
						_self.busy.display = true;
					}
				}, 80);
			},
			browse        : function () {
				let _self = this;
				if (_self.busy.searching === true) {
					return;
				}

				_self.reset();
				_self.canBrowse = !_self.canBrowse;

				if (_self.canBrowse) {
					if (_self.preload === 'true' || _self.preload === true) {
						_self.query();
					}
					setTimeout(function () {
						$(_self.$refs.search).focus();
					}, 0);
				}
			},
			query         : function () {
				let _self = this;
				if (_self.source) {
					_self.setBusy();

					let lookupCopy = _self.search;

					helpers.api.get(_self.source.list, { params : { lookup : lookupCopy } }).then(function (res) {
						if (lookupCopy === _self.search) {
							_self.result = res.data;
							_self.selected = null;
							_self.setIdle();
						}
					}).catch(function (err) {
						_self.setIdle();
						_self.$root.log(err).exception();
					});
				}
			},
			searchChanged : function (event) {
				let _self = this;
				if (event.target.value != null && event.target.value.length > 0 && _self.search !== event.target.value) {
					_self.search = event.target.value;

					let checkTick = function () {
						if (_self.canSearchTick > 0) {
							setTimeout(function () {
								_self.canSearchTick--;
								if (_self.canSearchTick === 0) {
									_self.query();
								} else {
									checkTick();
								}
							}, 20);
						}
					};

					if (_self.canSearchTick === 0) {
						_self.canSearchTick = 8;
						checkTick();
					} else {
						_self.canSearchTick = 8;
					}
				}
			},
			clear         : function () {
				this.$emit('input', null);
				this.preview = null;
				this.$emit('change', null);
				this.reset();
			},
			reset         : function () {
				let _self = this;
				if (_self.busy.searching === true) {
					return;
				}
				_self.search = null;
				_self.canBrowse = false;
				_self.presearch = null;
				_self.result = null;
				$(_self.$refs.search).val('');
			},
			select        : function (item, enter) {
				let _self = this;
				if (item != null) {
					_self.selected = item;
				} else if (_self.selected == null && _self.result != null && _self.result.length > 0) {
					_self.selected = _self.result[0];
				}

				if (enter === true) {
					_self.enter();
				}
			},
			up            : function () {
				let _self = this;
				if (_self.selected) {
					_self.select(_self.bounds().prev);
				} else {
					_self.select();
				}
			},
			down          : function () {
				let _self = this;
				if (_self.selected) {
					_self.select(_self.bounds().next);
				} else {
					_self.select();
				}
			},
			bounds        : function () {
				let _self = this;
				let result = {
					prev : null,
					next : null
				};
				if (_self.selected != null && _self.result != null) {
					for (let i = 0; i < _self.result.length; i++) {
						let item = _self.result[i];
						if (item.id === _self.selected.id) {
							result.prev = i >= 1 ? _self.result[i - 1] : null;
							result.next = i < _self.result.length - 1 ? _self.result[i + 1] : null;
						}
					}
				}

				return result;
			},
			cancel        : function () {
				this.reset();
			},
			enter         : function () {
				let _self = this;
				if (_self.selected) {
					_self.$emit('input', _self.selected.id);
					_self.preview = _self.selected;
					this.reset();
				} else if (_self.canCreate && _self.presearch && _self.presearch.length > 0) {
					_self.$emit('create', _self.presearch);
				} else {
					this.reset();
				}
			},
			addItem       : function () {
				let _self = this;
				if (_self.createSettings) {
					_self.reset();
					_self.canBrowse = false;
					_self.$root.modal(_self.createSettings.modal).form().then(function (preview) {
						_self.selected = preview;
						_self.$emit('input', _self.selected.id);
						_self.preview = _self.selected;

						if (_self.createSettings.success != null) {
							_self.$root.log(_self.createSettings.success).information();
						}
					}).catch(function () {
						_self.$root.log(err).exception();
					});
				}
			}
		},
		watch        : {
			selected : function (value) {
				this.presearch = null;
			},
			value    : function (value) {
				if (value == null) {
					this.clear();
				}

				this.updatePreview();
			}
		}
	};
});