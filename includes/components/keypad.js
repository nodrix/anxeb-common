'use strict';

anxeb.vue.include.component('keypad', function (helpers) {
	return {
		props    : ['value', 'max-integers', 'enter', 'cancel', 'delete', 'disabled', 'layout', 'dot', 'tabs', 'max', 'min', 'max-length'],
		template : '/components/keypad.vue',
		mounted  : function () { },
		methods  : {
			overwriteNext : function () {
				this.flags.overwrite = true;
			},
			tryOverwrite  : function () {
				if (this.flags.overwrite === true) {
					this.flags.overwrite = false;
					this.digits = '';
				}
			},
			pushKey       : function (c) {
				if (this.disabled === true) {
					return;
				}
				this.tryOverwrite();

				if (this.alpha === true) {
					if (this.maxLength == null || this.digits.length < this.maxLength) {
						this.digits += c;
					}
					return;
				}

				if (this.$value.toFixed(0).length < parseInt(this.maxIntegers)) {
					let sp = this.digits.split('.');
					if (sp.length <= 1 || (sp.length > 1 && sp[1].length < 2)) {
						this.digits += c;
					}
				}
			},
			sumKey        : function (n) {
				if (this.disabled === true) {
					return;
				}
				this.tryOverwrite();
				this.digits = this.$value + parseFloat(n);
			},
			reset         : function (force) {
				if (this.disabled === true && force !== true) {
					return;
				}
				this.flags.overwrite = false;
				if (this.alpha) {
					this.digits = '';
				} else {
					this.digits = '0';
				}
			},
			backspace     : function () {
				if (this.disabled === true) {
					return;
				}
				this.flags.overwrite = false;
				if (this.digits.length > 0) {
					let preq = this.digits.substring(0, this.digits.length - 1);
					if (preq.endsWith('.')) {
						preq = preq.substr(0, preq.length - 1);
					}
					this.digits = preq;
				}
			}
		},
		data     : function () {
			return {
				flags  : {
					overwrite : false
				},
				digits : ''
			}
		},
		watch    : {
			digits                   : function (value) {
				if (this.alpha === true) {
					this.$emit('input', value);
					return;
				}

				let v = helpers.tools.money.normalize(('0' + value) || 0);

				if (this.max != null) {
					if (v > this.max) {
						v = this.max;
					}
				}

				if (this.min != null) {
					if (v < this.min) {
						v = this.min;
					}
				}

				this.$emit('input', v);
			},
			'$root.keyboard.pressed' : {
				deep    : true,
				handler : function (input) {
					if (input.input) {
						return;
					}

					let _self = this;
					let code = input.code;
					let char = input.char;

					let isKeypad = code >= 96 && code <= 105;
					if (isKeypad) {
						char = input.key
					}

					let isNumber = (code >= 48 && code <= 57) || isKeypad;
					let isSlash = code === 191 || code === 111;
					let isDash = code === 109 || code === 189;
					let isAlpha = (code >= 65 && code <= 90);
					let isDot = code === 110 || code === 190;
					let isDel = code === 46;
					let isEsc = code === 27;
					let isSpace = code === 32;
					let isBackspace = code === 8;
					let isEnter = code === 13;

					let isEnabled = this.disabled !== true;
					if (isEnabled) {

						if (_self.tabs) {
							let isLeft = code === 37;
							let isUp = code === 38;
							let isRight = code === 39;
							let isDown = code === 40;

							if (isLeft || isUp || isRight || isDown) {
								_self.tabs(isLeft, isUp, isRight, isDown);
							}
						}

						if (isNumber) {
							_self.pushKey(char);
						} else if (_self.alpha && isSpace) {
							_self.pushKey(' ');
						} else if (_self.alpha && isDash) {
							_self.pushKey('-');
						} else if (_self.alpha && isSlash) {
							_self.pushKey('/');
						} else if (isDot) {
							if (!(this.dot === false || this.dot === 'false')) {
								if (_self.alpha || _self.digits.indexOf('.') === -1) {
									_self.pushKey('.');
								}
							}
						} else if (isBackspace) {
							_self.backspace();
						} else if (isEnter) {
							if (_self.enter) {
								_self.enter();
							}
						} else if (isDel) {
							if (_self.delete != null) {
								if (_self.delete()) {
									_self.reset();
								}
							} else {
								_self.reset();
							}
						} else if (isEsc) {
							if (_self.cancel) {
								_self.cancel();
							}
						} else if (_self.alpha && isAlpha) {
							_self.pushKey(char);
						}
					}
				}
			},
			value                    : function (value) {
				this.digits = value.toString();
			}
		},
		computed : {
			alpha  : function () {
				return this.layout === "full";
			},
			$value : function () {
				return this.value || 0;
			}
		}
	}
});