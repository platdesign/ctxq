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



	it('should set resturn values as attributes on context', () => {

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



});