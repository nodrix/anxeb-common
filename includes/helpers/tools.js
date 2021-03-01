'use strict';

anxeb.vue.include.helper('tools', {
	money         : {
		normalize : function (value, positive) {
			if (value == null || (typeof value !== 'number' && value.toString().length === 0)) {
				return null;
			}
			let result = Number(parseFloat(value).toFixed(2));
			if (positive === true) {
				if (result < 0) {
					result = 0;
				}
			}
			return result;
		}
	},
	format        : {
		number   : function (value, params) {
			let decimalCount = params != null && params.decimals != null ? params.decimals : 2;
			let thousandComma = params != null && params.comma != null ? params.comma : true;

			if (value == null) {
				value = 0;
			}

			value = parseFloat(value).toFixed(decimalCount);

			if (thousandComma === true) {
				value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			}
			return value
		},
		duration : function (value) {
			let date = typeof value === 'number' ? moment.unix(value) : value;

			let $days = moment().diff(date, 'days');
			let $hours = moment().diff(date, 'hours');
			let $minutes = moment().diff(date, 'minutes');
			let $seconds = moment().diff(date, 'seconds');

			let sufix;

			let isFuture = $seconds < 0;

			if (isFuture) {
				if (-$hours >= 24) {
					value = -$days;
					sufix = 'd';
				} else if (-$minutes >= 60) {
					value = -$hours;
					sufix = 'h';
				} else if (-$seconds >= 60) {
					value = -$minutes;
					sufix = 'm';
				} else {
					value = -$seconds;
					sufix = 's';
				}
			} else {
				if ($hours >= 24) {
					value = $days;
					sufix = 'd';
				} else if ($minutes >= 60) {
					value = $hours;
					sufix = 'h';
				} else if ($seconds >= 60) {
					value = $minutes;
					sufix = 'm';
				} else {
					value = $seconds;
					sufix = 's';
				}
			}

			if (isFuture) {
				return this.number(value, { comma : true, decimals : 0 }) + sufix + ' res';
			} else {
				return this.number(value, { comma : true, decimals : 0 }) + sufix;
			}
		},
		bytes    : function (value) {
			let _format = this;
			const ONE_KB = 1000;
			const ONE_MB = 1000000;
			let sufix = 'B';
			let caption = _format.number(value, { decimals : 0, comma : true });

			if (value >= ONE_MB) {
				sufix = 'MB';
				caption = _format.number((value / ONE_MB), { decimals : 2, comma : true });
			} else if (value >= ONE_KB) {
				sufix = 'KB';
				caption = _format.number((value / ONE_KB), { decimals : 2, comma : true });
			}
			return caption + ' ' + sufix;
		},
	},
	data          : {
		copy : function (data, params) {
			let result = JSON.parse(JSON.stringify(data));
			if (params) {
				for (let p in params) {
					result[p] = params[p];
				}
			}
			return result;
		}
	},
	delay         : function (ms) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve();
			}, ms);
		});
	},
	requiredError : function (prefix, fields, newMsg) {
		let _fields = [];
		let msg = newMsg || 'Uno o varios campos son requeridos en la solicitud';

		for (let f = 0; f < fields.length; f++) {
			_fields.push({
				name  : fields[f],
				index : f
			})
		}

		if (_fields.length > 0) {
			let err = {
				message : msg,
				code    : 8005,
				meta    : {
					fields : _fields
				}
			};

			this.highlight(err, {
				prefix : prefix
			});

			return err;
		} else {
			$("form .app-invalid-field").removeClass("app-invalid-field");
			return null;
		}
	},
	unhighlight   : function () {
		$("form .app-invalid-field").removeClass("app-invalid-field");
	},
	highlight     : function (err, params) {
		if (!err || err.$highlighted === true) {
			return;
		}
		$("form .app-invalid-field").removeClass("app-invalid-field");
		err.$highlighted = true;

		let defaultPrefix = (params && params.prefix ? params.prefix : 'model');
		let fields = err.meta && err.meta.fields ? err.meta.fields : (err.inner && err.inner.meta && err.inner.meta.fields ? err.inner.meta.fields : []);

		let inx = null;
		let focusField = null;

		let getContainer = function (field, prefix) {
			return $("[field-name='" + prefix + "." + field + "'],[alt-fields*='" + prefix + "." + field + "']")
		};

		for (let i = 0; i < fields.length; i++) {
			let field = fields[i];
			let $name = field.name;
			let container = getContainer($name, field.prefix || defaultPrefix);

			if (container.length === 0 && field.name.indexOf('.') > -1) {
				$name = field.name.split('.').filter(item => isNaN(item)).join('.');
				container = getContainer($name, field.prefix || defaultPrefix);
			}

			container.addClass("app-invalid-field");
			container.find(".app-field-custom-container").removeClass("app-focus-field");

			if (field.index !== undefined) {
				if (inx === null || inx > field.index) {
					inx = field.index;
					focusField = $name;
				}
			}
		}

		if (focusField) {
			let fieldContainer = getContainer(focusField, defaultPrefix);
			fieldContainer.find("input").focus();
			fieldContainer.find("select").focus();
			fieldContainer.find("textarea").focus();
			fieldContainer.find(".app-field-custom-container").addClass("app-focus-field");

			setTimeout(function () {
				fieldContainer.find("input").select();
				fieldContainer.find("textarea").select();
			}, 0);
		}
	}
});