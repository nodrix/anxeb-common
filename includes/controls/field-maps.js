'use strict';

anxeb.vue.include.component('field-maps', function (helpers) {
	let lock = false;

	return {
		template     : '/controls/field-maps.vue',
		inheritAttrs : false,
		props        : ['label', 'id', 'readonly', 'height', 'width', 'field-name', 'size', 'init-address', 'caption', 'value', 'maps'],
		created      : async function () {

		},
		mounted      : async function () {
			let _self = this;
			_self.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
			_self.init();
			if (!lock) {
				await _self.refresh();
			}
		},
		methods      : {
			init        : function () {
				let _self = this;
				_self.map = new _self.maps.Map(_self.$refs.container, {
					disableDefaultUI : true,
					scaleControl     : true,
					zoomControl      : true,
					scrollwheel      : false,
					mapTypeId        : _self.maps.MapTypeId.ROADMAP
				});
				_self.map.controls[_self.maps.ControlPosition.TOP_LEFT].push(_self.$refs.cbutton);
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
					_self.location = mapsMouseEvent.latLng;
				});
			},
			refresh     : async function () {
				let _self = this;

				lock = true;
				if (_self.value == null) {
					_self.geometry = _self.geometry || (await _self.getLocation(_self.initAddress || 'Dominican Republic'));
					if (_self.location == null) {
						_self.map.fitBounds(_self.geometry.viewport);
						_self.location = _self.geometry.location;
					}
				} else {
					_self.location = _self.value;
					_self.map.setZoom(16);
				}

				if (_self.marker == null) {
					_self.marker = new _self.maps.Marker({
						position  : _self.location,
						map       : _self.map,
						draggable : true,
						title     : _self.caption
					});

					_self.marker.addListener('dragend', function () {
						_self.location = _self.marker.getPosition();
					})
				}


				setTimeout(function () {
					_self.updateMap();
					lock = false;
				}, 200)

			},
			getLocation : function (address) {
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
			bringMarker : function () {
				this.location = this.map.getCenter();
				this.updateMap();
			},
			gotoMarker  : function () {
				this.updateMap();
			},
			updateMap   : function (value) {
				let _self = this;
				if (_self.marker && _self.map) {
					if (value || _self.value) {
						_self.marker.setPosition(value || _self.value);
						setTimeout(function () {
							_self.map.panTo(_self.marker.getPosition());
						}, 10);

					}
				}
			}
		},
		watch        : {
			location : function (value) {
				if (!lock) {
					this.$emit('input', value);
					this.updateMap(value);
				}
			},
			value    : function (value, old) {
				this.refresh();
			}
		},
		data         : function () {
			return {
				name     : null,
				marker   : null,
				map      : null,
				location : null,
				geometry : null,
				geocoder : null,
				loaded   : false,
			}
		},

	};
});