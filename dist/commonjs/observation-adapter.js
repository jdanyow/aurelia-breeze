"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

exports.install = install;
var ObjectObservationAdapter = require("aurelia-binding").ObjectObservationAdapter;
var BreezeObjectObserver = require("./property-observation").BreezeObjectObserver;
var BreezePropertyObserver = require("./property-observation").BreezePropertyObserver;


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

var BreezeObservationAdapter = (function () {
  function BreezeObservationAdapter() {}

  _prototypeProperties(BreezeObservationAdapter, null, {
    handlesProperty: {
      value: function handlesProperty(object, propertyName) {
        var entityType = object.entityType, property;
        return entityType && object.entityAspect && (property = entityType.getProperty(propertyName)) && property.isScalar;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getObserver: {
      value: function getObserver(object, propertyName) {
        var observerLookup;
        if (!handlesProperty(object, propertyName)) throw new Error("BreezeBindingAdapter does not support observing the " + propertyName + " property.  Check the handlesProperty method before calling createObserver.");
        observerLookup = obj.__breezeObserver__ || createObserverLookup(obj);
        return observerLookup.getObserver(propertyName);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return BreezeObservationAdapter;
})();

exports.BreezeObservationAdapter = BreezeObservationAdapter;
function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
}