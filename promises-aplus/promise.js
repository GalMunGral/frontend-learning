class _Promise {
  constructor(executor) {
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.callbacks = [];      
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    if (this.status !== 'pending') return;
    this.status = 'fulfilled';
    this.value = value;
    this.callbacks.forEach(queueMicrotask);
  }

  reject(reason) {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.reason = reason;
    this.callbacks.forEach(queueMicrotask);
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled != 'function') {
      onFulfilled = value => value;
    }
    if (typeof onRejected != 'function') {
      onRejected = reason => { throw reason; };
    }
    const promise = new _Promise(() => {});
    const processResult = () => {
      try {
        this.status === 'fulfilled'
          ? resolvePromise(promise, onFulfilled(this.value))
          : resolvePromise(promise, onRejected(this.reason));
      } catch (e) {
        promise.reject(e);
      }
    }
    this.status === 'pending'
      ? this.callbacks.push(processResult)
      : queueMicrotask(processResult);
    return promise;
  }
}

function resolvePromise(promise, x) {
  if (x === promise) {
    promise.reject(new TypeError());
  } else if (x instanceof _Promise) {
    if (x.status === 'fulfilled') {
      resolvePromise(promise, x.value)
    } else if (x.status === 'rejected') {
      promise.reject(x.reason);
    } else {
      x.then(
        value => resolvePromise(promise, value),
        reason => promise.reject(reason)
      );
    }
  } else if (typeof x == 'object' && x || typeof x == 'function') {
    let then;
    try {
      then = x.then;
    } catch (e) {
      promise.reject(e);
      return;
    }
    if (typeof then == 'function') {
      let hasCalled = false;
      try {
        then.call(
          x,
          value => {
            if (hasCalled) return;
            hasCalled = true;
            resolvePromise(promise, value)
          },
          reason => {
            if (hasCalled) return;
            hasCalled = true;
            promise.reject(reason)
          }
        );
      } catch (e) {
        if (hasCalled) return;
        promise.reject(e);
      }
    } else {
      promise.resolve(x);
    }
  } else {
    promise.resolve(x);
  }
}

module.exports = _Promise;