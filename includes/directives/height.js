'use strict';

anxeb.vue.include.directive('height', function (helpers) {

	let _originalStyles = null;

	let refresh = function (el, params) {
		let offset = params.offset;
		let height = params.screen.height;
		let styleValue = (height - offset) + 'px!important;';
		el.setAttribute('style', _originalStyles + 'height:' + styleValue);
	};

	return {
		bind     : function (el, directive) {
			_originalStyles = el.getAttribute('style');
			if (!_originalStyles.endsWith(';')) {
				_originalStyles += ';';
			}
			refresh(el, directive.value);
		},
		update   : function (el, directive, vnode) {
			refresh(el, directive.value);
		},
		inserted : function (el) {

		}
	}
});