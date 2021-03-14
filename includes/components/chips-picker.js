'use strict';

anxeb.vue.include.component('chips-picker', function (helpers) {
	return {
		template : '/components/chips-picker.vue',
		props    : ['value', 'api', 'binding', 'settings', 'layout', 'context-menu', 'action', 'excluded'],
		inject   : ['page', 'log', 'modal', 'dialogs'],
		created  : function () {
			this.refresh();
		},
		mounted  : function () { },
		updated() { },
		methods  : {
			refresh            : async function () {
				let _self = this;
				if (_self.api) {
					_self.busy = true;
					try {
						let res = await helpers.api.get(_self.api.get);
						_self.items = res.data;
						return _self.items;
					} catch (err) {
						_self.busy = false;
						_self.log(err).exception();
					}
				}
			},
			updateWith         : function (items) {
				this.items = items;
			},
			pick               : function (item) {
				let _self = this;
				_self.$emit('pick', item);
			},
			add                : async function () {
				let _self = this;
				_self.modal({
					title   : `Agregar ${_self.sufix}`,
					message : `Introduzca ${_self.isHe ? 'uno o varios' : 'una o varias'} ${_self.plural.toLowerCase()}`,
					prompt  : { label : 'Valores', rows : 6 },
					icon    : _self.icon,
					labels  : { accept : 'Guardar' }
				}).prompt(async function (button, modal) {
					try {
						let $names = modal.value.split('\n').filter(item => item != null && item.length > 0);
						let params = {};
						if (_self.api.parameter) {
							params[_self.api.parameter] = { names : $names }
						} else {
							params = { names : $names }
						}

						await helpers.api.post(_self.api.post, params);
						await _self.refresh();

						_self.log(`${_self.plural} ${_self.isHe ? 'agregados' : 'agregadas'} correctamente`).information();
					} catch (err) {
						modal.exception(err);
						return false;
					}
				});
			},
			edit               : async function (item) {
				let _self = this;
				try {
					_self.modal({
						title   : `Editar ${_self.sufix}`,
						message : 'Introduzca el nuevo nombre',
						prompt  : { label : 'Nombre', rows : 1, value : item.name, enterEvent : true },
						icon    : 'fa-edit',
						labels  : { accept : 'Guardar' }
					}).prompt(async function (button, modal) {
						try {
							let params = {};
							if (_self.api.parameter) {
								params[_self.api.parameter] = {
									id   : item.id,
									name : modal.value
								}
							} else {
								params = {
									id   : item.id,
									name : modal.value
								}
							}

							let res = await helpers.api.post(_self.api.post, params);
							await _self.refresh();

							_self.log(`${_self.sufix} ${_self.isHe ? 'actualizado' : 'actualizada'} correctamente`).information();

							item.name = res.data.name;
						} catch (err) {
							modal.exception(err);
							return false;
						}
					});
				} catch (err) {
					_self.log(err).exception();
				}
			},
			remove             : function (item) {
				let _self = this;
				if (_self.api.delete) {
					_self.modal(`¿Está seguro que quiere eliminar ${_self.isHe ? 'el' : 'la'} ${_self.sufix.toLowerCase()} <b>${item.name}</b>?`).confirm(async function () {
						try {
							await helpers.api.delete(_self.api.delete + '/' + item.id);
							await _self.refresh();
							_self.log(`${_self.sufix} ${_self.isHe ? 'eliminado' : 'eliminada'} correctamente`).information();
						} catch (err) {
							_self.log(err).exception();
						}
					});
				}
			},
			defaultContextMenu : function (item) {
				let _self = this;
				let actions = [{
					caption : 'Cambiar Nombre',
					action  : function () {
						_self.edit(item);
					}
				}, {
					caption : `Eliminar ${_self.sufix}`,
					visible : _self.api.delete != null,
					divider : true,
					class   : ['text-danger'],
					action  : function () {
						_self.remove(item);
					}
				}];

				if (_self.action && _self.action.context === true) {
					actions.unshift({
						caption : _self.action.title || `Seleccionar ${_self.sufix}`,
						action  : function () {
							_self.pick(item);
						}
					});
				}
				return actions;
			},
		},
		watch    : {
			items : function (items, old) {
				if (old !== null) {
					this.$emit('changed', items);
				}
			}
		},
		computed : {
			filtered : function () {
				if (this.excluded != null && this.excluded.length > 0) {
					return this.items.filter((item) => !this.excluded.includes(item.id));
				} else {
					return this.items;
				}
			},
			isHe     : function () {
				return this.layout == null || (this.layout.he === true || this.layout.she === false);
			},
			sufix    : function () {
				return this.layout && this.layout.sufix ? this.layout.sufix : 'Elemento';
			},
			plural   : function () {
				return this.layout && this.layout.plural ? this.layout.plural : 'Elementos';
			},
			stack    : function () {
				return this.layout && this.layout.stack === true;
			},
			icon     : function () {
				return (this.layout ? this.layout.icon : null) || 'fa-dot-circle';
			}
		},
		data     : function () {
			return {
				items : null,
				busy  : false
			}
		}
	};
});