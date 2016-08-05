'use strict';


module.exports = function ctxq() {

	let service = {};
	let queue = [];

	service.push = function(key, fn) {
		queue.push((scope) => {
			if (key && fn) {
				return Promise.resolve(fn(scope)).then((res) => scope[key] = res);
			}
			return key(scope);
		});
		return this;
	};

	service.run = function(scope, errorTransform) {
		scope = scope || {};

		return Promise.resolve(scope)
			.then((_scope) =>
				queue.reduce((p, fn) =>
					p.then(() => fn(_scope)
				), Promise.resolve())
				.then(
					() => _scope,
					(err) => {
							if(errorTransform) {
								return Promise.resolve(errorTransform(err, _scope));
							}
							return Promise.reject(err);
					}
				)
			);
	};

	return service;

};