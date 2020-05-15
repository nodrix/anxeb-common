'use strict';

anxeb.vue.include.helper('api', function () {
	let api = axios.create({
		baseURL : anxeb.settings.client.api
	});

	api.interceptors.response.use(function (response) {
		return response;
	}, function (err) {
		let arr = err.response && err.response.data ? err.response.data : err;
		if (arr && (arr.code === 401 || arr.code === 6013 || arr.code === 6012 || arr.code === 6006)) {
			anxeb.vue.root.session.reset();
			setTimeout(function () {
				anxeb.vue.root.navigate('/');
			}, 2000);
		}
		anxeb.vue.root.page.idle();
		return Promise.reject(err);
	});

	api.interceptors.request.use(function (request) {
		let token = localStorage.token;
		if (token) {
			request.headers['Authorization'] = 'Bearer ' + token;
		}
		return request;
	}, function (err) {
		anxeb.vue.root.page.idle();
		return Promise.reject(err);
	});

	let call = function (method, url, params) {
		return new Promise(function (resolve, reject) {
			api[method](url, params).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				err = err.response && err.response.data && err.response.data.message ? err.response.data : err;
				if (params && params.mute !== true) {
					//anxeb.vue.root.log(err).exception();
				}
				if (reject) {
					reject(err);
				}
			});
		});
	};

	return {
		interceptors : api.interceptors,
		axios        : api,
		get          : function (url, params) {
			return call('get', url, params);
		},
		post         : function (url, params) {
			return call('post', url, params);
		},
		delete       : function (url, params) {
			return call('delete', url, params);
		},
		put          : function (url, params) {
			return call('put', url, params);
		}
	};
});