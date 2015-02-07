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

  function createCanObserveLookup(entityType) {
    var value = {},
        properties = entityType.getProperties(),
        property,
        ii = properties.length,
        i;

    for (i = 0; i < ii; i++) {
      property = properties[i];

      value[property.name] = property.isDataProperty || property.isScalar;
    }

    Object.defineProperty(entityType, "__canObserve__", {
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
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      BreezeObservationAdapter = _export("BreezeObservationAdapter", (function () {
        function BreezeObservationAdapter() {}

        _prototypeProperties(BreezeObservationAdapter, null, {
          handlesProperty: {
            value: function handlesProperty(object, propertyName) {
              var entityType, canObserve;

              if (!object.entityAspect || !(entityType = object.entityType)) return false;

              canObserve = entityType.__canObserve__ || createCanObserveLookup(entityType);

              return !!canObserve[propertyName];
            },
            writable: true,
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
            configurable: true
          }
        });

        return BreezeObservationAdapter;
      })());
    }
  };
});