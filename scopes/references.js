'use strict';

anxeb.vue.include.scope('references', function (helpers, instance) {
	return {
		watch    : {
			$route(to, from) {
				if (!this.$route.params.referenceId) {
					this.close();
				}
			}
		},
		mounted  : function () {
			let _self = this;

			if (!_self.route) {
				_self.log('Ruta inválida').information();
				return;
			}

			_self.page.menu.add({
				caption : 'Refrescar',
				hint    : 'Refrescar',
				icon    : 'fa-sync',
				action  : function () {
					_self.refresh(true);
				}
			});
		},
		methods  : {
			stepup    : function () {
				let _self = this;

				let selection = '';
				if (_self.parent) {
					selection = '/' + _self.parent.id + '/items';
				}

				instance.navigate('/references/' + (_self.route.parent ? _self.route.parent.name : _self.route.name) + selection, _self.parent && _self.parent.parent ? { parent : _self.parent.parent } : undefined).then(function () {
					_self.parent = null;
					_self.selected = null;
					_self.refresh();
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			stepdown  : function (reference, row) {
				let _self = this;

				let selection = '';
				if (row && row.id) {
					selection = '/' + row.id + '/items';
				}

				instance.navigate('/references/' + (_self.route.child.name || _self.route.name) + selection, { parent : reference.id }).then(function () {
					_self.selected = null;
					_self.refresh();
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			close     : function () {
				let _self = this;
				if (_self.$route.path === '/references/' + _self.$route.params.type) {
					_self.selected = null;
					_self.parent = null;
					_self.refresh();
				} else {
					instance.navigate('/references/' + _self.$route.params.type, _self.parent ? { parent : _self.parent.id } : undefined).then(function () {
						_self.selected = null;
						_self.refresh();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				}
			},
			prepare   : function (reference) {
				let _self = this;
				reference.meta = reference.meta || {};
				if (_self.route && _self.route.meta) {
					for (let key in _self.route.meta) {
						let fdef = _self.route.meta[key];
						let meta = reference.meta[key] || {};
						reference.meta[key] = meta;
						meta.label = fdef.label;
						meta.type = fdef.type;
						meta.options = fdef.options;
						meta.value = meta.value || null;
					}
				}
				return reference;
			},
			select    : function (reference, callback) {
				let id = typeof reference === 'object' ? reference.id : reference;
				let _self = this;
				_self.page.busy();
				helpers.api.get('/references/' + id, { params : { childs : 'items' } }).then(function (res) {
					_self.selected = _self.prepare(res.data);

					let section = _self.$route.path.endsWith('/detail') ? 'detail' : 'items';
					if (_self.route.child.last) {
						section = 'detail';
					}

					if (_self.selected != null && !_self.$root.can(_self.selected).be.edited) {
						section = 'items';
					}

					let uri = '/references/' + _self.$route.params.type + '/' + id + '/' + section;
					helpers.root.navigate(uri, _self.parent ? { parent : _self.parent.id } : undefined);
					if (callback) {
						callback();
					}
					_self.page.idle();
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			remove    : function (item, refresh) {
				let _self = this;
				_self.modal({
					title   : 'Eliminar ' + _self.types[item.type].caption,
					message : '¿Está seguro que quiere eliminar <b>' + item.name + '</b> del listado de ' + _self.types[item.type].plural
				}).confirm(function () {
					_self.page.busy();
					helpers.api.delete('/references/' + item.id).then(function (res) {
						if (refresh === true) {
							_self.refresh();
						} else {
							_self.close();
						}
						_self.log('Elemento eliminado correctamente').information();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				});
			},
			add       : function (parent) {
				let _self = this;
				_self.modal({
					title   : 'Agregar ' + (parent ? _self.route.child.caption : _self.route.caption),
					message : 'Introduzca uno o varios elementos:',
					prompt  : { label : 'Valores', rows : 6 }
				}).confirm(function (button, modal) {
					helpers.api.post('/references', {
						reference : {
							names  : modal.value.split('\n').filter(function (item) {
								return item != null && item.length > 0;
							}),
							type   : parent ? (_self.route.child.type || parent.type) : _self.route.type,
							parent : parent ? parent.id : (_self.parent ? _self.parent.id : undefined),
						}
					}).then(function (res) {
						_self.log('Elementos agregados correctamente').information();
						_self.refresh();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				});
			},
			edit      : function (item) {
				let _self = this;
				_self.modal({
					title     : 'Editar ' + _self.types[item.type].caption,
					component : 'form-reference'
				}).form(_self.prepare(item)).then(function () {
					_self.log('Elemento actualizado correctamente').information();
					_self.refresh();
				}).catch(function (err) {
					_self.log(err).exception();
				});
			},
			save      : function (reference) {
				let _self = this;
				helpers.api.post('/references', {
					reference : reference
				}).then(function (res) {
					_self.log('Elemento actualizado correctamente').information();
					_self.refresh();
				}).catch(function (err) {
					helpers.tools.highlight(err, { prefix : '$parent.selected' });
					_self.log(err).exception();
				});
			},
			refresh(msg) {
				let _self = this;
				_self.page.busy();

				let loadReferences = function () {
					helpers.api.get('/references', { params : { type : _self.route.type, childs : 'count', parent : _self.parent ? _self.parent.id : undefined } }).then(function (res) {
						_self.references = res.data;
						if (msg === true) {
							_self.log('Referencias cargadas correctamente').information();
						} else {
							_self.page.idle();
						}

						if (_self.$route.params.referenceId) {
							_self.select(_self.$route.params.referenceId);
						}
					}).catch(function (err) {
						_self.log(err).exception();
					});
				};

				if (_self.$route.query.parent) {
					helpers.api.get('/references/' + _self.$route.query.parent).then(function (res) {
						_self.parent = res.data;
						_self.page.setup({
							title    : _self.route.title,
							subtitle : _self.parent.name,
							caption  : _self.route.title,
							icon     : 'fa-arrow-left',
							action   : function () {
								_self.stepup();
							}
						});

						loadReferences();
					}).catch(function (err) {
						_self.log(err).exception();
					});
				} else {
					_self.parent = null;
					_self.page.setup({
						title    : _self.route.title,
						subtitle : _self.parent ? _self.parent.name : null,
						icon     : _self.route.icon || 'fa-stream'
					});
					loadReferences();
				}
			},
			normalize : function () {
				let _self = this;
				_self.types = {};

				for (let name in _self.routes) {
					let route = _self.routes[name];
					route.name = name;
					route.last = false;
					_self.types[route.type] = route;

					if (typeof route.child === 'string') {
						let defChild = {
							he       : true,
							title    : 'Lista de Elementos',
							caption  : 'Elemento',
							plural   : 'Elementos',
							last     : route.child === '!',
							infinite : route.child === '*'
						};
						route.child = _self.routes[route.child] || defChild;
						route.child.parent = route;
					}
				}
			}
		},
		created  : function () {
			this.normalize();
			this.refresh();
		},
		computed : {
			type  : function () {
				return this.route ? this.route.type : null;
			},
			route : function () {
				return this.routes[this.$route.params.type];
			}
		},
		data     : function () {
			return {
				references : null,
				selected   : null,
				parent     : null,
				types      : null,
				routes     : {
					countries   : { he : true, title : 'Lista de Países', caption : 'País', plural : 'Países', type : 'country', child : 'states' },
					states      : { he : false, title : 'Lista de Provincias', caption : 'Provincia', plural : 'Provincias', type : 'state', child : 'cities' },
					cities      : { he : false, title : 'Lista de Ciudades', caption : 'Ciudad', plural : 'Ciudades', type : 'city', child : 'sectors' },
					sectors     : { he : true, title : 'Lista de Sectores', caption : 'Sector', plural : 'Sectores', type : 'sector', child : '!' },
					products    : { he : true, title : 'Categorías de Productos', caption : 'Categoría de Producto', plural : 'Categorías de Productos', type : 'product', child : '*', icon : 'fa-sitemap' },
					services    : { he : true, title : 'Categorías de Servicios', caption : 'Categoría de Servicio', plural : 'Categorías de Servicios', type : 'service', child : '*', icon : 'fa-sitemap' },
					bundles     : { he : true, title : 'Categorías de Combos', caption : 'Categoría de Combo', plural : 'Categorías de Combos', type : 'bundle', child : '*', icon : 'fa-sitemap' },
					stores      : { he : true, title : 'Categorías de Locales', caption : 'Categoría de Locale', plural : 'Categorías de Locales', type : 'store', child : '*', icon : 'fa-sitemap' },
					enterprises : { he : false, title : 'Categorías de Empresas', caption : 'Categoría de Empresa', plural : 'Categorías de Empresas', type : 'enterprise', child : '*', icon : 'fa-sitemap' },
					inventory   : { he : true, title : 'Categorías de Inventario', caption : 'Categoría de Inventario', plural : 'Categorías de Inventario', type : 'inventory', child : '*', icon : 'fa-sitemap' },
					units       : {
						he   : false, title : 'Unidades de Medidas', caption : 'Unidad de Medida', plural : 'Unidades de Medidas', type : 'unit', child : '*',
						meta : {
							nature         : { label : 'Tipo Unidad', options : { discrete : 'Discreta', divisible : 'Divisible' } },
							singular_sufix : { label : 'Sufijo Singular', type : 'text' },
							plural_sufix   : { label : 'Sufijo Plural', type : 'text' },
							plural_name    : { label : 'Nombre Plural', type : 'text' },
						}
					},
					vats        : {
						he   : false, title : 'Clases Impositivas', caption : 'Clase Impositiva', plural : 'Clases Impositivas', type : 'vat', child : '*',
						meta : {
							vat    : { label : 'Impuesto (%)', type : 'number' },
							symbol : { label : 'Símbolo', type : 'text' }
						}
					},
				},
				enums      : {},
			};
		}
	}
});