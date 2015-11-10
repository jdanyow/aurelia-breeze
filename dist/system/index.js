System.register(['aurelia-binding', 'aurelia-http-client', 'breeze', './promise-adapter', './validation/error-renderer', './validation/bootstrap-error-renderer', './observation-adapter', './ajax-adapter'], function (_export) {
  'use strict';

  var ObserverLocator, HttpClient, breeze, Q, ErrorRenderer, BootstrapErrorRenderer, BreezeObservationAdapter, AjaxAdapter;

  _export('configure', configure);

  function configure(frameworkConfig) {
    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

    breeze.config.setQ(Q);

    frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

    frameworkConfig.container.registerInstance(ErrorRenderer, new BootstrapErrorRenderer());

    frameworkConfig.globalResources('./validation/breeze-validation');

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
    }, function (_validationErrorRenderer) {
      ErrorRenderer = _validationErrorRenderer.ErrorRenderer;

      _export('ErrorRenderer', _validationErrorRenderer.ErrorRenderer);
    }, function (_validationBootstrapErrorRenderer) {
      BootstrapErrorRenderer = _validationBootstrapErrorRenderer.BootstrapErrorRenderer;
    }, function (_observationAdapter) {
      BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
    }, function (_ajaxAdapter) {
      AjaxAdapter = _ajaxAdapter.AjaxAdapter;
    }],
    execute: function () {}
  };
});