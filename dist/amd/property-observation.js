define(["exports"], function (exports) {
  "use strict";

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var BreezePropertyObserver = (function () {
    function BreezePropertyObserver(owner, obj, propertyName) {
      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.isSVG = false;
    }

    _prototypeProperties(BreezePropertyObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.obj[this.propertyName] = newValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      trigger: {
        value: function trigger(newValue, oldValue) {
          var callbacks = this.callbacks,
              i = callbacks.length;

          while (i--) {
            callbacks[i](newValue, oldValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          return this.owner.subscribe(this, callback);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BreezePropertyObserver;
  })();

  exports.BreezePropertyObserver = BreezePropertyObserver;
  var BreezeObjectObserver = (function () {
    function BreezeObjectObserver(obj) {
      this.obj = obj;
      this.observers = {};
    }

    _prototypeProperties(BreezeObjectObserver, null, {
      subscribe: {
        value: function subscribe(propertyObserver, callback) {
          var _this = this;
          var callbacks = propertyObserver.callbacks;
          callbacks.push(callback);

          if (!this.observing) {
            this.observing = true;
            this.subscription = this.obj.entityAspect.propertyChanged.subscribe(function (entity, property, propertyName, oldValue, newValue, parent) {
              _this.handleChanges([{ name: propertyName, object: entity, type: "update", oldValue: oldValue }]);
            });
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
            if (callbacks.length > 0) return;
            this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
            this.observing = false;
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          var propertyObserver = this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this, this.obj, propertyName));

          return propertyObserver;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleChanges: {
        value: function handleChanges(changeRecords) {
          var updates = {},
              observers = this.observers,
              i = changeRecords.length;

          while (i--) {
            var change = changeRecords[i],
                name = change.name;

            if (!(name in updates)) {
              var observer = observers[name];
              updates[name] = true;
              if (observer) {
                observer.trigger(change.object[name], change.oldValue);
              }
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BreezeObjectObserver;
  })();

  exports.BreezeObjectObserver = BreezeObjectObserver;
});