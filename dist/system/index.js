System.register(["breeze", "aurelia-binding", "./observation-adapter", "./ajax-adapter", "./promise-adapter"], function (_export) {
  "use strict";

  var breeze, ObjectObservationAdapter, BreezeObservationAdapter, AjaxAdapter, Q;
  _export("install", install);

  function install(aurelia) {
    breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

    breeze.config.registerAdapter("ajax", AjaxAdapter);
    breeze.config.initializeAdapterInstance("ajax", "aurelia", true);

    breeze.config.setQ(Q);
  }
  return {
    setters: [function (_breeze) {
      breeze = _breeze["default"];
    }, function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_ajaxAdapter) {
      AjaxAdapter = _ajaxAdapter.AjaxAdapter;
    }, function (_promiseAdapter) {
      Q = _promiseAdapter.Q;
    }],
    execute: function () {}
  };
});