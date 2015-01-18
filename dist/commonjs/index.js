"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var BreezeScalarPropertyObserver = (function () {
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
        var callbacks = this.callbacks || [];

        callbacks.push(callback);

        if (!this.hasOwnProperty("propertyChangedSubscription")) {
          this.propertyChangedSubscription = this.object.entityAspect.propertyChanged.subscribe(function (entity, property, propertyName, oldValue, newValue, parent) {
            for (var i = 0; i < callbacks.length; i++) {
              callbacks[i]();
            }
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    dispose: {
      value: function dispose() {
        if (!this.object) return;

        this.object.entityAspect.propertyChanged.unsubscribe(this.propertyChangedSubscription);
        this.object = null;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return BreezeScalarPropertyObserver;
})();

exports.BreezeScalarPropertyObserver = BreezeScalarPropertyObserver;
var BreezeNonScalarPropertyObserver = function BreezeNonScalarPropertyObserver() {};

exports.BreezeNonScalarPropertyObserver = BreezeNonScalarPropertyObserver;
var BreezeBindingAdapter = (function () {
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

exports.BreezeBindingAdapter = BreezeBindingAdapter;