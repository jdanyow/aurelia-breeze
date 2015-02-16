System.register(["breeze", "aurelia-binding", "aurelia-http-client", "./observation-adapter", "./ajax-adapter", "./promise-adapter"], function (_export) {
  "use strict";

  var breeze, ObjectObservationAdapter, HttpClient, BreezeObservationAdapter, AjaxAdapter, setHttpClientFactory, Q;
  _export("install", install);

  function install(aurelia) {
    breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

    breeze.config.registerAdapter("ajax", AjaxAdapter);
    breeze.config.initializeAdapterInstance("ajax", "aurelia", true);
    setHttpClientFactory(function () {
      return aurelia.container.get(HttpClient);
    });

    breeze.config.setQ(Q);
  }
  return {
    setters: [function (_breeze) {
      breeze = _breeze["default"];
    }, function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_ajaxAdapter) {
      AjaxAdapter = _ajaxAdapter.AjaxAdapter;
      setHttpClientFactory = _ajaxAdapter.setHttpClientFactory;
    }, function (_promiseAdapter) {
      Q = _promiseAdapter.Q;
    }],
    execute: function () {}
  };
});