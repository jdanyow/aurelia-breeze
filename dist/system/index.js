System.register(["aurelia-binding", "./observation-adapter", "./property-observation"], function (_export) {
  "use strict";

  var ObjectObservationAdapter;
  _export("install", install);

  function install(aurelia) {
    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
  }
  return {
    setters: [function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_observationAdapter) {
      _export("install", _observationAdapter.install);

      _export("BreezeObservationAdapter", _observationAdapter.BreezeObservationAdapter);
    }, function (_propertyObservation) {
      _export("BreezeObjectObserver", _propertyObservation.BreezeObjectObserver);

      _export("BreezePropertyObserver", _propertyObservation.BreezePropertyObserver);
    }],
    execute: function () {}
  };
});