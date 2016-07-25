# ctxq

Simple promise queue with context.


# Install

`npm install --save ctxq`


# Usage

## `ctxq.push(key, handler)`

Result of handler (wrapped in `Promise.resolve`) will be assigned as `key` in `context`. Returns ctxq instance for method chaining.

## `ctxq.push(handler)`

Result of handler (wrapped in `Promise.resolve`) will not be assigned to `context`. Returns ctxq instance for method chaining.


## `ctxq.run(context)`

Runs the queue in the same order as handlers are pushed to it. Each handler will be called with `context` as argument. 


# Example

```javascript
const CQ = require('ctxq');

const queue = CQ();

queue
	.push('user', (ctx) => db.createUser(ctx.input.user))
	.push((ctx) => email.sendMail('welcome', ctx.user))
	.push('profile', (ctx) => db.createProfileForUser(ctx.user))
	.run({ input: { user:{ /*...*/ }}})
	.then((ctx) => ctx.user)
	.then(reply, reply);
```


#Author

[@platdesign](https://twitter.com/platdesign)
