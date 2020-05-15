'use strict';

let divo = function (referenceComposite) {
	let parts = referenceComposite.split('|');
	return {
		root  : parts[0] || null,
		value : parts[1] || null,
	}
};

let formReference = function (root, value) {
	return {
		root  : {
			id   : root.id,
			name : root.name,
			meta : root.meta,
			type : root.type
		},
		value : {
			id   : value.id,
			name : value.name,
			meta : value.meta,
			type : value.type
		}
	}
};

module.exports = function (context) {
	return {
		composite : async function (items) {
			let responses = {};


			for (let key in items) {


				let item = items[key];
				if (item != null) {
					let parts = item.split('|');
					let keyresult = {};

					for (let i = 0; i < parts.length; i++) {
						let reference = await context.data.retrieve.Reference(parts[i]);
						if (reference) {
							keyresult[reference.type] = reference.toClient();
						}
					}

					responses[key] = keyresult;
				}
			}

			return responses;
		},
		retrieve  : function (items) {
			return new Promise(function (resolve, reject) {
				let requests = {};

				for (let key in items) {
					let item = items[key];
					if (item != null) {
						if (item.indexOf('|') > -1) {
							let comp = divo(item);
							requests[key + '_root'] = { id : comp.root, from : 'Reference' };
							requests[key + '_value'] = { id : comp.value, from : 'Reference' };
						} else {
							requests[key] = { id : item, from : 'Reference' };
						}
					}
				}

				context.data.multiple(requests).then((data) => {
					let result = {};

					for (let key in items) {
						let item = items[key];
						if (item != null) {
							if (item.indexOf('|') > -1) {
								result[key] = formReference(data[key + '_root'], data[key + '_value']);
							} else {
								result[key] = data[key];
							}
						}
					}
					resolve(result);
				}).catch(reject);
			});
		}
	};
};

