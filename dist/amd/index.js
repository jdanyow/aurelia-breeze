define(['exports', 'aurelia-binding', 'aurelia-http-client', 'breeze', './promise-adapter', './validation/error-renderer', './validation/bootstrap-error-renderer', './observation-adapter', './ajax-adapter'], function (exports, _aureliaBinding, _aureliaHttpClient, _breeze, _promiseAdapter, _validationErrorRenderer, _validationBootstrapErrorRenderer, _observationAdapter, _ajaxAdapter) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _breeze2 = _interopRequireDefault(_breeze);

  exports.ErrorRenderer = _validationErrorRenderer.ErrorRenderer;

  function configure(frameworkConfig) {
    _breeze2['default'].config.initializeAdapterInstance('modelLibrary', 'backingStore');

    _breeze2['default'].config.setQ(_promiseAdapter.Q);

    frameworkConfig.container.get(_aureliaBinding.ObserverLocator).addAdapter(new _observationAdapter.BreezeObservationAdapter());

    frameworkConfig.container.registerInstance(_validationErrorRenderer.ErrorRenderer, new _validationBootstrapErrorRenderer.BootstrapErrorRenderer());

    frameworkConfig.globalResources('./validation/breeze-validation');

    var adapter = _breeze2['default'].config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return frameworkConfig.container.get(_aureliaHttpClient.HttpClient);
    });
  }
});