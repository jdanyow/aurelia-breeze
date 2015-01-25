define(["exports", "./observation-adapter", "./property-observation"], function (exports, _observationAdapter, _propertyObservation) {
  "use strict";

  exports.install = install;
  exports.install = _observationAdapter.install;
  exports.BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
  exports.BreezeObjectObserver = _propertyObservation.BreezeObjectObserver;
  exports.BreezePropertyObserver = _propertyObservation.BreezePropertyObserver;
  function install(aurelia) {
    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationdapter());
  }
});