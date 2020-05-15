'use strict';

module.exports = function (context) {
	let _self = this;
	let _context = context;

	_self.update = async function (params) {
		let sequence = await context.data.find.Sequence({
			type   : params.type,
			name   : params.name,
			entity : params.entity || null
		});

		if (sequence == null) {
			sequence = context.data.create.Sequence({
				type   : params.type,
				name   : params.name,
				entity : params.entity || null,
				value  : params.initial != null ? params.initial : 1
			});
		} else {
			sequence.value = params.initial != null ? (params.initial - 1) : 0
		}
		await sequence.persist();
	};

	//TODO Convert to async/await
	_self.increment = function (type, sequences) {
		return new Promise(function (resolve, reject) {
			let promises = [];

			let newPromise = function (name, params) {
				return new Promise(function (resolve, reject) {
					_context.data.find.Sequence(
						{ type : type, name : name, entity : params.entity || null }
					).then(function (sequence) {
						if (sequence == null) {
							sequence = _context.data.create.Sequence({
								type   : type,
								name   : name,
								entity : params.entity || null,
								value  : params.initial != null ? params.initial : 1
							});
						} else {
							sequence.value++;
						}

						sequence.persist().then(function (sq) {
							resolve(sq.toClient());
						}).catch(reject);
					}).catch(reject);
				});
			};

			for (let name in sequences) {
				let sequenceItem = sequences[name];
				if (sequenceItem) {
					promises.push(newPromise(name, sequenceItem));
				}
			}

			Promise.all(promises).then((sequences) => {
				let result = {};
				for (let i = 0; i < sequences.length; i++) {
					let sequence = sequences[i];
					result[sequence.name] = sequence.value;
				}
				resolve(result);
			}).catch(function (err) {
				_context.log.exception.sequence_generation_error.args(err).throw(_context);
			});

		});
	};
};

