export class Q {
  static defer() {
    return new Deferred();
  }

  static resolve(data) {
    return new Promise(function(resolve, reject) { resolve(data); });
  }

  static reject(reason) {
    return new Promise(function(resolve, reject) { reject(reason); });
  }
}

export class Deferred {
  constructor() {
    var self = this;
    this.promise = new Promise(
      function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });
  }
}