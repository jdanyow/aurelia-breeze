System.register([], function (_export) {
  "use strict";

  var _prototypeProperties, Q, Deferred;
  return {
    setters: [],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      Q = _export("Q", (function () {
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
      })());
      Deferred = _export("Deferred", function Deferred() {
        var self = this;
        this.promise = new Promise(function (resolve, reject) {
          self.resolve = resolve;
          self.reject = reject;
        });
      });
    }
  };
});