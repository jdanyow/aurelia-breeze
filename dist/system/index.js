System.register(["breeze", "./promise-adapter", "aurelia-binding", "./observation-adapter", "aurelia-http-client"], function (_export) {
  var breeze, Q, ObjectObservationAdapter, BreezeObservationAdapter, HttpClient;

  _export("install", install);

  function install(aurelia) {
    // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
    breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

    // make breeze use our ES6 Promise based version of Q.
    breeze.config.setQ(Q);

    // provide aurelia with a way to observe breeze properties.
    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

    // provide the ajax adapter with an HttpClient factory...
    // the adapter lazily gets the HttpClient instance to enable scenarios where
    // the aurelia-breeze plugin is installed prior to the HttpClient being
    // configured in the container.
    var adapter = breeze.config.initializeAdapterInstance("ajax", "aurelia", true);
    adapter.setHttpClientFactory(function () {
      return aurelia.container.get(HttpClient);
    });
  }

  return {
    setters: [function (_breeze) {
      breeze = _breeze["default"];
    }, function (_promiseAdapter) {
      Q = _promiseAdapter.Q;
    }, function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }],
    execute: function () {
      "use strict";
    }
  };
});