System.register(["./observation-adapter", "./property-observation"], function (_export) {
  "use strict";

  _export("install", install);

  function install(aurelia) {
    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationdapter());
  }
  return {
    setters: [function (_observationAdapter) {
      _export("install", _observationAdapter.install);

      _export("BreezeObservationAdapter", _observationAdapter.BreezeObservationAdapter);
    }, function (_propertyObservation) {
      _export("BreezeObjectObserver", _propertyObservation.BreezeObjectObserver);

      _export("BreezePropertyObserver", _propertyObservation.BreezePropertyObserver);
    }],
    execute: function () {}
  };
});