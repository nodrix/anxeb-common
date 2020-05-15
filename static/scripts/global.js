(function ($) {
	'use strict';
	moment.locale('es');

	FastClick.attach(document.body);

	if ( !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./) ){
		$('body').addClass('ie');
	}

	let ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
	if( (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua) ){
		$('body').addClass('smart');
	}

	$('input, textarea').each(function(){
		$(this).val() ? $(this).addClass('has-value') : $(this).removeClass('has-value');
	});

	$(document).on('blur', 'input, textarea', function(e){
		$(this).val() ? $(this).addClass('has-value') : $(this).removeClass('has-value');
	});

	$(document).on('click', '[ui-nav] a', function (e) {
		let $this = $(e.target), $active, $li;
		$this.is('a') || ($this = $this.closest('a'));

		$li = $this.parent();
		$active = $li.siblings( ".active" );
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