'use strict';

anxeb.vue.include.component('field-input', function () {

	let formatValue = function (value, options) {
		if (options.forceUppercase) {
			value = value ? value.toUpperCase() : value;
		}
		if (!options.allowEmpty) {
			value = value === '' ? null : value;
		}
		if (options.percent != null) {
			value = parseFloat(value) * 100;
		}
		if (options.decimals != null) {
			value = parseFloat(value).toFixed(parseInt(options.decimals));
		}
		if (options.comma != null) {
			value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}
		return value;
	};

	return {
		vendors      : ['/styles/calendar.css', '/vendors/v-calendar/v-calendar.umd.min.js'],
		template     : '/controls/field-input.vue',
		inheritAttrs : false,
		props        : ['label', 'value', 'focus', 'required', 'type', 'id', 'rows', 'allow-empty', 'force-uppercase', 'max-length', 'min-length', 'readonly', 'decimals', 'prefix', 'percent', 'sufix', 'comma', 'field-name', 'value-color', 'value-weight', 'date-format', 'calendar-placement', 'unix', 'align', 'auto-select', 'height'],
		mounted      : function () {
			let _self = this;
			this.name = _self.fieldName || (_self.$vnode.data.model != null ? _self.$vnode.data.model.expression : null);
		},
		data         : function () {
			return {
				name : null,
				date : null,
			}
		},
		methods      : {
			clear : function () {
				this.date = null;
			},
		},
		watch        : {
			date : function (value) {
				if (value != null) {
					let date = null;
					if (typeof value === 'number') {
						date = moment.unix(value);
					} else {
						date = moment(value);
					}
					if (this.unix === true || this.unix === 'true') {
						this.$emit('input', date.utc().unix());
					} else {
						this.$emit('input', date);
					}
				} else {
					this.$emit('input', null);
				}
			}
		},
		computed     : {
			post_value : function () {
				let _self = this;
				let value = null;

				if (_self.value != null) {
					if (_self.type === 'calendar') {
						let date = null;

						if (_self.value) {
							if (typeof _self.value === 'number') {
								date = moment.unix(_self.value);
							} else {
								date = moment(_self.value);
							}
						}
						if (_self.date == null) {
							_self.date = date.toDate();
						}

						if (date) {
							let format = _self.dateFormat || 'D/M/YYYY';

							if (format === 'short') {
								value = date.format('D [de] MMMM');
							} else if (format === 'full') {
								return date.format('D [de] MMMM YYYY');
							} else if (format === 'timed') {
								return date.format('DD/MM/YYYY h:mm:A');
							} else {
								return date.format(format);
							}
						}
					} else {
						value = formatValue(_self.value, {
							allowEmpty     : _self.allowEmpty === 'true',
							forceUppercase : _self.forceUppercase === 'true',
							decimals       : _self.decimals,
							percent        : _self.percent,
							comma          : _self.comma
						});

						let sufix = _self.sufix;
						if (_self.percent === 'true') {
							sufix = '%';
						}

						value = _self.prefix != null ? _self.prefix + value : value;
						value = sufix != null ? value + sufix : value;
					}
				}

				return value;
			},
			listener   : function () {
				let _self = this;
				return Object.assign({}, this.$listeners, {
						input : function (event) {
							_self.$emit('input', event.target.value);
							/*_self.$emit('input', formatValue(event.target.value, {
								allowEmpty     : _self.allowEmpty === 'true',
								forceUppercase : _self.forceUppercase === 'true',
								decimals       : _self.decimals
							}));*/
						}
					}
				)
			}
		}
	};
});