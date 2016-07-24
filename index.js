'use strict';


module.exports = function() {

	return function ctxq() {

		let service = {};
		let queue = [];

		service.push = function(key, fn) {
			queue.push((scope) => {
				if(key && fn) {
					return fn(scope).then((res) => scope[key] = res);
				}
				return key(scope);
			});
		};

		service.run = function(scope) {
			scope = scope || {};

			return queue.reduce((p, fn) => p.then(() => fn(scope)), Promise.resolve()).then(() => scope);
		};

		return service;
	};

};