define(["exports", "./observation-adapter", "./property-observation"], function (exports, _observationAdapter, _propertyObservation) {
  "use strict";

  exports.install = _observationAdapter.install;
  exports.BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
  exports.BreezeObjectObserver = _propertyObservation.BreezeObjectObserver;
  exports.BreezePropertyObserver = _propertyObservation.BreezePropertyObserver;
});