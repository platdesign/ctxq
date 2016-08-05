'use strict';

const Code = require('code');
const expect = Code.expect;

const CQ = require('../');



describe('unit', () => {



	it('should sequentially work on queue', () => {

		let res = [];

		return CQ()
			.push(() => res.push(1))
			.push(() => res.push(2))
			.push(() => res.push(3))
			.push(() => res.push(4))
			.run()
			.then(() => expect(res).to.equal([1, 2, 3, 4]));

	});



	it('should set return values as attributes on context', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => 2)
			.push('c', () => 3)
			.run()
			.then((ctx) => expect(ctx).to.equal({
				a: 1,
				b: 2,
				c: 3
			}));

	});


	it('should set resolved promise values as attributes on context', () => {

		return CQ()
			.push('a', () => Promise.resolve(1))
			.push('b', () => Promise.resolve(2))
			.push('c', () => Promise.resolve(3))
			.run()
			.then((ctx) => expect(ctx).to.equal({
				a: 1,
				b: 2,
				c: 3
			}));

	});



	it('should use given object on run(ctx) as context', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => 2)
			.push('c', () => 3)
			.run({
				d: 4
			})
			.then((ctx) => expect(ctx).to.equal({
				a: 1,
				b: 2,
				c: 3,
				d: 4
			}));

	});



	it('should use result of given promise on run(ctx) as context', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => 2)
			.push('c', () => 3)
			.run(Promise.resolve({
				d: 4
			}))
			.then((ctx) => expect(ctx).to.equal({
				a: 1,
				b: 2,
				c: 3,
				d: 4
			}));

	});



	it('should break queue on first error', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => Promise.reject(new Error()))
			.push('c', () => 3)
			.run()
			.then(
				() => {
					throw new Error('Should not resolve');
				}, (err) => expect(err).to.be.an.instanceOf(Error)
			);

	});



	it('should catch error and transform it', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => Promise.reject(new Error()))
			.push('c', () => 3)
			.run({}, (err, scope) => Promise.reject(scope.a))
			.then(
				() => {
					throw new Error('Should not resolve');
				}, (err) => expect(err).to.equal(1)
			);

	});



	it('should catch error and transform it to resolve', () => {

		return CQ()
			.push('a', () => 1)
			.push('b', () => Promise.reject(new Error()))
			.push('c', () => 3)
			.run({}, (err, scope) => scope.a)
			.then((res) => expect(res).to.equal(1));

	});



	it('should chain two queues', () => {

		let ctxA = CQ()
			.push('a', () => 1)
			.push('b', () => 2)
			.push('c', () => 3);


		return CQ()
			.push('d', (ctx) => ctx.a)
			.push('e', (ctx) => ctx.b)
			.push('f', (ctx) => ctx.c)
			.run( ctxA.run() )
			.then((res) => expect(res).to.equal({
				a: 1,
				b: 2,
				c: 3,
				d: 1,
				e: 2,
				f: 3
			}));


	});



});