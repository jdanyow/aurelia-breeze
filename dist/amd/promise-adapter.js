define(["exports"], function (exports) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var Q = exports.Q = (function () {
    function Q() {}

    _prototypeProperties(Q, {
      defer: {
        value: function defer() {
          return new Deferred();
        },
        writable: true,
        configurable: true
      },
      resolve: {
        value: function resolve(data) {
          return new Promise(function (resolve, reject) {
            resolve(data);
          });
        },
        writable: true,
        configurable: true
      },
      reject: {
        value: function reject(reason) {
          return new Promise(function (resolve, reject) {
            reject(reason);
          });
        },
        writable: true,
        configurable: true
      }
    });

    return Q;
  })();
  var Deferred = exports.Deferred = function Deferred() {
    var self = this;
    this.promise = new Promise(function (resolve, reject) {
      self.resolve = resolve;
      self.reject = reject;
    });
  };

  exports.__esModule = true;
});