(function ($) {
	'use strict';
	moment.locale('es');

	FastClick.attach(document.body);

	if (!!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
		$('body').addClass('ie');
	}

	let ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
	if ((/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua)) {
		$('body').addClass('smart');
	}

	$('input, textarea').each(function () {
		$(this).val() ? $(this).addClass('has-value') : $(this).removeClass('has-value');
	});

	$(document).on('blur', 'input, textarea', function (e) {
		$(this).val() ? $(this).addClass('has-value') : $(this).removeClass('has-value');
	});

	$(document).on('click', '[ui-nav] a', function (e) {
		let $this = $(e.target), $active, $li;
		$this.is('a') || ($this = $this.closest('a'));

		$li = $this.parent();
		$active = $li.siblings(".active");
		$li.toggleClass('active');
		$active.removeClass('active');
	});
})(jQuery);

function disableTouch(e) {
	e.stopPropagation();
	return false;
}

function enableTouch(e, el) {
	e.stopPropagation();
	return true;
}

String.prototype.toCamelCase = function () {
	if (this == null) {
		return null;
	}
	if (this.length === 1) {
		return this.toUpperCase();
	}
	let result = this
		.replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
		.replace(/\s/g, '')
		.replace(/^(.)/, function ($1) { return $1.toLowerCase(); });

	return result[0].toUpperCase() + result.substr(1);
}

String.prototype.toSlug = function (separator = "-") {
	return this
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 ]/g, '')
		.replace(/\s+/g, separator);
};