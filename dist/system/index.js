System.register(['aurelia-binding', 'aurelia-http-client', 'breeze', './promise-adapter', './observation-adapter', './ajax-adapter', './error-renderer'], function (_export) {
  'use strict';

  var ObserverLocator, HttpClient, breeze, Q, BreezeObservationAdapter, AjaxAdapter, ErrorRenderer, BootstrapErrorRenderer;

  _export('configure', configure);

  function configure(frameworkConfig) {
    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

    breeze.config.setQ(Q);

    frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

    frameworkConfig.container.registerTransient(ErrorRenderer, BootstrapErrorRenderer);

    frameworkConfig.globalResources('./breeze-validation');

    var adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return frameworkConfig.container.get(HttpClient);
    });
  }

  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_breeze) {
      breeze = _breeze['default'];
    }, function (_promiseAdapter) {
      Q = _promiseAdapter.Q;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_ajaxAdapter) {
      AjaxAdapter = _ajaxAdapter.AjaxAdapter;
    }, function (_errorRenderer) {
      ErrorRenderer = _errorRenderer.ErrorRenderer;
      BootstrapErrorRenderer = _errorRenderer.BootstrapErrorRenderer;
    }],
    execute: function () {}
  };
});