'use strict';

anxeb.vue.include.component('field-maps', function (helpers) {
	return {
		template     : '/controls/field-maps.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'height', 'width', 'field-name', 'size', 'init-address', 'caption', 'value', 'maps', 'address', 'zoom', 'options', 'circle'],
		created      : async function () {

		},
		mounted      : async function () {
			let _self = this;
			_self.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
			_self.init();
			if (!_self.lock) {
				await _self.refresh();
			}
		},
		methods      : {
			init         : function () {
				let _self = this;
				_self.map = new _self.maps.Map(_self.$refs.container, {
					scaleControl     : !_self.isReadonly,
					draggable        : !_self.isReadonly,
					disableDefaultUI : true,
					zoomControl      : !_self.isReadonly,
					scrollwheel      : _self.isReadonly ? false : (_self.options != null ? _self.options.scrolling === true : false),
					mapTypeId        : _self.maps.MapTypeId.ROADMAP
				});

				if (!_self.isReadonly) {
					_self.map.controls[_self.maps.ControlPosition.TOP_LEFT].push(_self.$refs.cbutton);

					_self.map.addListener('zoom_changed', function () {
						if (_self.location) {
							_self.location.zoom = _self.map.getZoom();
						}
					});

					_self.map.addListener('center_changed', function () {

					});

					_self.map.addListener('tilesloaded', function () {
						if (!_self.loaded) {
							setTimeout(function () {
								_self.loaded = true;
							}, 500);
						}
					});
					_self.map.addListener('click', function (mapsMouseEvent) {
						_self.location = _self.parseCoords(mapsMouseEvent.latLng);
					});
				}
			},
			refresh      : async function () {
				let _self = this;
				_self.lock = true;
				if (_self.value == null) {
					_self.geometry = _self.geometry || (await _self.getLocation(_self.initAddress || 'Dominican Republic'));
					if (_self.location == null) {
						_self.map.fitBounds(_self.geometry.viewport);
						_self.location = _self.parseCoords(_self.geometry.location);
					}
				} else {
					_self.location = _self.parseCoords(_self.value, _self.value.zoom);
				}

				if (_self.marker == null) {
					_self.marker = new _self.maps.Marker({
						position  : _self.location,
						map       : _self.map,
						draggable : !_self.isReadonly,
						title     : _self.caption
					});

					_self.marker.addListener('dragend', function () {
						_self.location = _self.parseCoords(_self.marker.getPosition());
					})
				}


				setTimeout(function () {
					_self.updateMap();

					_self.lock = false;
				}, 200)

			},
			getLocation  : function (address) {
				let _self = this;
				return new Promise(function (resolve, reject) {
					_self.geocoder = _self.geocoder || (new _self.maps.Geocoder());

					let retries = 0;
					let getGeometry = function () {
						_self.geocoder.geocode({ address : address }, (results, status) => {
							if (status !== 'OK' || !results[0]) {
								if (retries > 10) {
									reject(status);
								} else {
									setTimeout(function () {
										retries++;
										getGeometry();
									}, 200);
								}
							} else {
								resolve(results[0].geometry);
							}
						});
					}

					getGeometry();
				});
			},
			bringMarker  : function () {
				this.location = this.parseCoords(this.map.getCenter());
				this.updateMap();
			},
			gotoMarker   : function () {
				this.updateMap();
			},
			updateMap    : function (params) {
				let value = params != null ? params.value : null;
				let _self = this;
				if (_self.marker && _self.map) {
					if (value || _self.value) {
						let $position = value || _self.value;
						_self.marker.setPosition($position);
						_self.renderCircle();

						setTimeout(function () {
							if (_self.location.zoom || _self.zoomed === false) {
								let $zoom = _self.location.zoom || (_self.options != null ? _self.options.zoom : null) || 15;
								if ($zoom) {
									_self.map.setZoom($zoom);
									_self.zoomed = true;
								}
							} else if (_self.options != null && _self.options.zoom != null) {
								_self.map.setZoom(_self.options.zoom);
							}
							_self.map.panTo(_self.marker.getPosition());
						}, 10);
					}
				}
			},
			parseCoords  : function (location, zoom) {
				return {
					lat  : typeof location.lat === 'function' ? location.lat() : location.lat,
					lng  : typeof location.lng === 'function' ? location.lng() : location.lng,
					zoom : zoom || this.map.getZoom()
				}
			},
			renderCircle : function () {
				let _self = this;
				let $position = _self.value;
				if (_self.circle != null && $position != null) {
					let $radius;
					if (isNaN(_self.circle.radius)) {
						$radius = 0;
					} else {
						$radius = parseFloat(_self.circle.radius);
					}

					if (_self.$circle == null) {
						_self.$circle = new _self.maps.Circle({
							strokeWeight : 0,
							fillColor    : _self.circle.color || "#fd2727",
							fillOpacity  : _self.circle.opacity || 0.25,
							clickable    : false,
							map          : _self.map,
							center       : $position,
							radius       : $radius
						});
					} else {
						_self.$circle.setRadius($radius);
						_self.$circle.setCenter($position)
					}
				}
			}
		},
		watch        : {
			location : {
				handler : function (value) {
					if (!this.lock) {
						this.$emit('input', value);
						this.updateMap({
							value : value
						});
					}
				},
				deep    : true
			},
			circle   : {
				handler : function (value) {
					this.renderCircle();
				},
				deep    : true
			},
			address  : async function (value) {
				let _self = this;
				if (!_self.lock) {
					_self.lock = true;
					_self.geometry = await _self.getLocation(value || 'Santo Domingo');

					if (_self.geometry && _self.geometry.location) {
						_self.map.fitBounds(_self.geometry.viewport);
						_self.location = _self.parseCoords(_self.geometry.location);

						if (_self.marker == null) {
							_self.marker = new _self.maps.Marker({
								position  : _self.location,
								map       : _self.map,
								draggable : true,
								title     : _self.caption
							});

							_self.marker.addListener('dragend', function () {
								_self.location = _self.parseCoords(_self.marker.getPosition());
							})
						} else {
							_self.marker.setPosition(_self.location);
							setTimeout(function () {
								_self.map.panTo(_self.marker.getPosition());
							}, 10);
						}
					}
					_self.lock = false;
				}

			},
			value    : function (value, old) {
				this.refresh();
			}
		},
		computed     : {
			isReadonly : function () {
				return this.readonly === true || this.readonly === 'true';
			}
		},
		data         : function () {
			return {
				$circle  : null,
				lock     : null,
				name     : null,
				marker   : null,
				map      : null,
				location : null,
				geometry : null,
				geocoder : null,
				loaded   : false,
				zoomed   : false,
			}
		},

	};
});