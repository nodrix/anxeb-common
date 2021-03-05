'use strict';

anxeb.vue.include.service('modal', function (helpers) {

	return function (component, params) {

		let fetchModal = async function (callback) {
			try {
				let $title = (typeof params === 'string' ? null : (params != null ? params.title : null));
				let modal = await helpers.root.$fetch('modal');

				if ($title == null) {
					let topHeader = await helpers.root.$fetch('top-header', 500);
					$title = topHeader.caption || topHeader.title;
				}

				if (!modal.active) {
					modal.reset();
					modal.title = $title;
					callback(modal);
					return modal;
				}
			} catch (err) { }
			return null;
		};

		return {
			success : function (formParams) {
				formParams.message = (typeof params === 'string' ? params : formParams.message) || null;
				return new Promise(function (resolve, reject) {
					setTimeout(function () {
						fetchModal(function (modal) {
							modal.show({
								message   : false,
								loaded    : false,
								size      : formParams ? formParams.size : 'normal',
								width     : formParams ? formParams.width : null,
								component : {
									name    : 'form-success',
									params  : formParams,
									resolve : resolve,
									reject  : reject
								},
								onCancel  : function () {
									reject();
								}
							});
						});
					}, 200);
				});
			},
			failed  : function (formParams) {
				formParams.message = (typeof params === 'string' ? params : formParams.message) || null;
				return new Promise(function (resolve, reject) {
					setTimeout(function () {
						fetchModal(function (modal) {
							modal.show({
								message   : false,
								loaded    : false,
								size      : formParams ? formParams.size : 'normal',
								width     : formParams ? formParams.width : null,
								component : {
									name    : 'form-failed',
									params  : formParams,
									resolve : resolve,
									reject  : reject
								},
								onCancel  : function () {
									reject();
								}
							});
						});
					}, 200);
				});
			},
			report  : function (formParams) {
				return new Promise(function (resolve, reject) {
					fetchModal(function (modal) {
						modal.show({
							message   : false,
							loaded    : false,
							size      : formParams ? formParams.size : 'normal',
							width     : formParams ? formParams.width : null,
							component : {
								name    : 'report-preview',
								params  : formParams,
								resolve : resolve,
								reject  : reject
							},
							onCancel  : function () {
								reject();
							}
						});
					});
				});
			},
			form    : function (formParams) {
				return new Promise(function (resolve, reject) {
					fetchModal(function (modal) {
						modal.show({
							message   : false,
							loaded    : false,
							size      : formParams ? formParams.size : 'normal',
							width     : formParams ? formParams.width : null,
							component : {
								name    : typeof params === 'string' ? params : params.component,
								params  : formParams,
								resolve : resolve,
								reject  : reject
							},
							onCancel  : function () {
								reject();
							}
						});
					});
				});
			},
			inform  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message     : typeof params === 'string' ? params : params.message,
						icon        : (params && params !== 'string' && params.icon ? params.icon : null) || 'fa-info-circle',
						onCancel    : callback,
						dismissable : true
					}, [{
						text   : 'OK',
						key    : 'OK',
						close  : true,
						action : callback
					}]);
				});
			},
			alert   : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message     : typeof params === 'string' ? params : params.message,
						icon        : 'fa-exclamation-triangle text-danger',
						onCancel    : callback,
						dismissable : true
					}, [{
						text   : 'OK',
						key    : 'OK',
						close  : true,
						action : callback
					}]);
				});
			},
			dialog  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message  : typeof params === 'string' ? params : params.message,
						icon     : 'fa-question-circle',
						onCancel : callback,
					}, [{
						text   : 'Si',
						key    : 'YES',
						close  : true,
						action : callback
					}, {
						text   : 'No',
						key    : 'NO',
						close  : true,
						action : callback
					}, {
						text   : 'Cancelar',
						key    : 'CANCEL',
						close  : true,
						action : callback
					}]);
				});
			},
			confirm : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message     : typeof params === 'string' ? params : params.message,
						icon        : 'fa-question-circle',
						prompt      : params.prompt,
						onCancel    : modal.close,
						dismissable : true
					}, [{
						text     : 'Si',
						key      : 'YES',
						prompted : params.prompt != null,
						close    : true,
						action   : callback
					}, {
						text  : 'No',
						key   : 'NO',
						close : true
					}]);
				});
			},
			prompt  : function (callback) {
				fetchModal(function (modal) {
					modal.show({
						message     : typeof params === 'string' ? params : params.message,
						icon        : params.icon || 'fa-info-circle',
						prompt      : params.prompt,
						buttons     : params.buttons,
						onCancel    : modal.close,
						dismissable : true
					}, [{
						text     : (params && params.labels ? params.labels.accept : null) || 'Aceptar',
						key      : 'ACCEPT',
						prompted : params.prompt != null,
						close    : true,
						action   : callback
					}, {
						text  : (params && params.labels ? params.labels.cancel : null) || 'Cancelar',
						key   : 'CANCEL',
						close : true
					}]);
				});
			}
		}
	}
});