System.register(["aurelia-binding", "./property-observation"], function (_export) {
  "use strict";

  var ObjectObservationAdapter, BreezeObjectObserver, BreezePropertyObserver, _prototypeProperties, BreezeObservationAdapter;
  _export("install", install);

  function createObserverLookup(obj) {
    var value = new BreezeObjectObserver(obj);

    Object.defineProperty(obj, "__breezeObserver__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  function install(aurelia) {
    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
  }
  return {
    setters: [function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_propertyObservation) {
      BreezeObjectObserver = _propertyObservation.BreezeObjectObserver;
      BreezePropertyObserver = _propertyObservation.BreezePropertyObserver;
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
      };

      BreezeObservationAdapter = (function () {
        function BreezeObservationAdapter() {}

        _prototypeProperties(BreezeObservationAdapter, null, {
          handlesProperty: {
            value: function handlesProperty(object, propertyName) {
              var entityType = object.entityType, property;
              return !!(entityType && object.entityAspect && (property = entityType.getProperty(propertyName)) && property.isScalar);
            },
            writable: true,
            enumerable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(object, propertyName) {
              var observerLookup;
              if (!this.handlesProperty(object, propertyName)) throw new Error("BreezeBindingAdapter does not support observing the " + propertyName + " property.  Check the handlesProperty method before calling createObserver.");
              observerLookup = object.__breezeObserver__ || createObserverLookup(object);
              return observerLookup.getObserver(propertyName);
            },
            writable: true,
            enumerable: true,
            configurable: true
          }
        });

        return BreezeObservationAdapter;
      })();
      _export("BreezeObservationAdapter", BreezeObservationAdapter);
    }
  };
});