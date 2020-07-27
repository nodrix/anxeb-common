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
		number : function (value, params) {
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

		let prefix = (params && params.prefix ? params.prefix : 'model');
		let fields = err.meta && err.meta.fields ? err.meta.fields : (err.inner && err.inner.meta && err.inner.meta.fields ? err.inner.meta.fields : []);

		let inx = null;
		let focusField = null;

		let getContainer = function (field) {
			return $("[field-name='" + prefix + "." + field + "'],[alt-fields*='" + prefix + "." + field + "']")
		};

		for (let i = 0; i < fields.length; i++) {
			let field = fields[i];
			let $name = field.name;
			if (field.name.indexOf('.') > -1) {
				$name = field.name.split('.').filter(item => isNaN(item)).join('.');
			}

			let container = getContainer($name);
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
			let fieldContainer = getContainer(focusField);
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