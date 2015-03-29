System.register([], function (_export) {
  var _createClass, _classCallCheck, Q, Deferred;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      Q = _export("Q", (function () {
        function Q() {
          _classCallCheck(this, Q);
        }

        _createClass(Q, null, {
          defer: {
            value: function defer() {
              return new Deferred();
            }
          },
          resolve: {
            value: function resolve(data) {
              return new Promise(function (resolve, reject) {
                resolve(data);
              });
            }
          },
          reject: {
            value: function reject(reason) {
              return new Promise(function (resolve, reject) {
                reject(reason);
              });
            }
          }
        });

        return Q;
      })());
      Deferred = _export("Deferred", function Deferred() {
        _classCallCheck(this, Deferred);

        var self = this;
        this.promise = new Promise(function (resolve, reject) {
          self.resolve = resolve;
          self.reject = reject;
        });
      });
    }
  };
});