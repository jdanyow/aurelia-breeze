System.register([], function (_export) {
  "use strict";

  var _prototypeProperties, BreezeScalarPropertyObserver, BreezeNonScalarPropertyObserver, BreezeBindingAdapter;
  return {
    setters: [],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      BreezeScalarPropertyObserver = (function () {
        function BreezeScalarPropertyObserver(object, propertyName) {
          this.object = object;
          this.propertyName = propertyName;
        }

        _prototypeProperties(BreezeScalarPropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.object[this.propertyName];
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(value) {
              this.object[this.propertyName] = value;
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              var _this = this;
              if (!this.callbacks) this.callbacks = [];
              var callbacks = this.callbacks;

              callbacks.push(callback);

              if (!this.hasOwnProperty("propertyChangedSubscription")) {
                this.propertyChangedSubscription = this.object.entityAspect.propertyChanged.subscribe(function (entity, property, propertyName, oldValue, newValue, parent) {
                  for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i]();
                  }
                });
              }

              return function () {
                callbacks.splice(callbacks.indexof(callback), 1);
                if (callbacks.length > 0) return;
                _this.object.entityAspect.propertyChanged.unsubscribe(_this.propertyChangedSubscription);
              };
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return BreezeScalarPropertyObserver;
      })();
      _export("BreezeScalarPropertyObserver", BreezeScalarPropertyObserver);

      BreezeNonScalarPropertyObserver = function BreezeNonScalarPropertyObserver() {};

      _export("BreezeNonScalarPropertyObserver", BreezeNonScalarPropertyObserver);

      BreezeBindingAdapter = (function () {
        function BreezeBindingAdapter() {}

        _prototypeProperties(BreezeBindingAdapter, null, {
          handlesProperty: {
            value: function handlesProperty(object, propertyName) {
              var entityType = object.entityType;
              return entityType && object.entityAspect && entityType.getProperty(propertyName);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          createObserver: {
            value: function createObserver(object, propertyName) {
              if (object.entityType.getProperty(propertyName).isScalar) return new BreezeScalarPropertyObserver(object, propertyName);

              throw new Error("Not Implemented:  non-scalar data properties and navigation properties");
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return BreezeBindingAdapter;
      })();
      _export("BreezeBindingAdapter", BreezeBindingAdapter);
    }
  };
});