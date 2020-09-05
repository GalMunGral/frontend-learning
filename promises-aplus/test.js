const promisesAplusTests = require("promises-aplus-tests");
const _Promise = require('./promise');

promisesAplusTests({
  resolved(value) {
    return new _Promise((resolve) => {
      resolve(value);
    });
  },
  rejected(reason) {
    return new _Promise((_, reject) => {
      reject(reason);
    });
  },
  deferred() {
    let resolve, reject, promise = new _Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    return { promise, resolve, reject };
  }
}, function (err) {
  console.log(err);
});