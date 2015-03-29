define(["exports"], function (exports) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var BreezePropertyObserver = exports.BreezePropertyObserver = (function () {
    function BreezePropertyObserver(obj, propertyName, subscribe) {
      _classCallCheck(this, BreezePropertyObserver);

      this.obj = obj;
      this.propertyName = propertyName;
      this.subscribe = subscribe;
    }

    _createClass(BreezePropertyObserver, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        }
      },
      setValue: {
        value: function setValue(newValue) {
          this.obj[this.propertyName] = newValue;
        }
      }
    });

    return BreezePropertyObserver;
  })();

  var BreezeObjectObserver = exports.BreezeObjectObserver = (function () {
    function BreezeObjectObserver(obj) {
      _classCallCheck(this, BreezeObjectObserver);

      this.obj = obj;
      this.observers = {};
      this.callbacks = {};
      this.callbackCount = 0;
    }

    _createClass(BreezeObjectObserver, {
      subscribe: {
        value: function subscribe(propertyName, callback) {
          if (!this.callbacks[propertyName]) {
            this.callbacks[propertyName] = [callback];
          } else if (this.callbacks[propertyName].indexOf(callback) !== -1) {
            return; // throw?
          } else {
            this.callbacks[propertyName].push(callback);
          }

          if (this.callbackCount === 0) {
            this.subscription = this.obj.entityAspect.propertyChanged.subscribe(this.handleChanges.bind(this));
          }

          this.callbackCount++;

          return this.unsubscribe.bind(this, propertyName, callback);
        }
      },
      unsubscribe: {
        value: function unsubscribe(propertyName, callback) {
          var callbacks = this.callbacks[propertyName],
              index = callbacks.indexOf(callback);
          if (index === -1) {
            return; // throw?
          }
          callbacks.splice(callbacks.indexOf(callback), 1);
          this.callbackCount--;
          if (this.callbackCount === 0) {
            this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
          }
        }
      },
      getObserver: {
        value: function getObserver(propertyName) {
          return this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName, this.subscribe.bind(this, propertyName)));
        }
      },
      handleChanges: {
        value: function handleChanges(change) {
          var callbacks = this.callbacks[change.propertyName],
              i,
              ii,
              newValue;
          if (!callbacks) {
            return;
          }

          newValue = this.obj[change.propertyName];

          for (i = 0, ii = callbacks.length; i < ii; i++) {
            callbacks[i](newValue, change.oldValue);
          }
        }
      }
    });

    return BreezeObjectObserver;
  })();
});