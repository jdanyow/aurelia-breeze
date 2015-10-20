define(['exports', './property-observation'], function (exports, _propertyObservation) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function createObserverLookup(obj) {
    var value = new _propertyObservation.BreezeObjectObserver(obj);

    Object.defineProperty(obj, '__breezeObserver__', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  function createCanObserveLookup(entityType) {
    var value = {};
    var properties = entityType.getProperties();
    for (var i = 0, ii = properties.length; i < ii; i++) {
      var property = properties[i];

      value[property.name] = property.isDataProperty || property.isScalar;
    }

    Object.defineProperty(entityType, '__canObserve__', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  var BreezeObservationAdapter = (function () {
    function BreezeObservationAdapter() {
      _classCallCheck(this, BreezeObservationAdapter);
    }

    BreezeObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
      var type = object.entityType;
      if (!type || !(type.__canObserve__ || createCanObserveLookup(type))[propertyName]) {
        return null;
      }

      var observerLookup = object.__breezeObserver__ || createObserverLookup(object);
      return observerLookup.getObserver(propertyName);
    };

    return BreezeObservationAdapter;
  })();

  exports.BreezeObservationAdapter = BreezeObservationAdapter;
});