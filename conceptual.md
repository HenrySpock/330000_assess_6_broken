### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?
Asynchronous code in JavaScript refers to callbacks, promises, and async/await functions (and potentially some other thing I've not yet learned.) These methods allow for asynchronous code to run without block the main (single) thread, with the goal of improving performance and user experience.

- What is a Promise?
A "Promise" in JavaScript is an object that represents code that is not yet resolved. By using a promise, methods can be chained and executed on the promise once it is resolved, without the blockage of the main (single) thread.

- What are the differences between an async function and a regular function?
An async function allows for the writing of of asynchronous code with the await keyword, which waits for a promise resolution before completing execution. Regular functions are, conversely, synchronous (and do not support 'await').

- What is the difference between Node.js and Express.js?
Node.js is a runtime environment that allows for JavaScript to be used for programming on the server-side. Express.js is a framework which runs on top of Node.js to provide things like routing, middleware and request handling.

- What is the error-first callback pattern?
In Node.js programming, this is a convention where the first argument of a callback is the error object, and the second argument is used for passing the result or data. The intent is to allow for more consistent error handling and prevent errors from being ignored.

- What is middleware?
In Node.js, any 'middleware' is a function that sits between a client request and a server response, which performs things like authentication, logging, and data processing. 

- What does the `next` function do?
In Express.js, 'next' passes control from one middleware function to the 'next.'

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```
It is making three separate requests to the same API endpoint (which, depending on how the api is set up, may be the only way possible, but is always a consideration - how many operations are necessary to achieve the desired result.)

It is an async function, but doesn't use 'Promise.all' to wait for the completion of requests, which may return incomplete data and lead to errors.

