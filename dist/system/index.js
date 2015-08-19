System.register(['breeze', './promise-adapter', 'aurelia-binding', './observation-adapter', 'aurelia-http-client', './ajax-adapter'], function (_export) {
  'use strict';

  var breeze, Q, ObjectObservationAdapter, BreezeObservationAdapter, HttpClient;

  _export('configure', configure);

  function configure(frameworkConfig) {
    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

    breeze.config.setQ(Q);

    frameworkConfig.container.registerInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

    var adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return frameworkConfig.container.get(HttpClient);
    });
  }

  return {
    setters: [function (_breeze) {
      breeze = _breeze['default'];
    }, function (_promiseAdapter) {
      Q = _promiseAdapter.Q;
    }, function (_aureliaBinding) {
      ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_ajaxAdapter) {}],
    execute: function () {}
  };
});