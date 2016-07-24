# ctxq

Simple promise queue with context.


# Install

`npm install --save ctxq`


# Usage

## `ctxq.push(key, handler)`

Result of handler will be assigned as `key` in `context`.

## `ctxq.push(handler)`

Result of handler will not be assigned to `context`.


## `ctxq.run(context)`

Runs the queue in the same order as handlers are pushed to it. Each handler will be called with `context` as argument. 


# Example

```javascript
const CQ = require('ctxq');

const queue = CQ();

queue.push('user', (ctx) => db.createUser(ctx.input.user));
queue.push((ctx) => email.sendMail('welcome', ctx.user));
queue.push('profile', (ctx) => db.createProfileForUser(ctx.user));

queue.run({ input: { user:{ /*...*/ }}})
.then((ctx) => ctx.user)
.then(reply, reply);
```


#Author

[@platdesign](https://twitter.com/platdesign)
