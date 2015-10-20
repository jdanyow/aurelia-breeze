define(['exports', 'aurelia-binding', 'aurelia-http-client', 'breeze', './promise-adapter', './observation-adapter', './ajax-adapter', './error-renderer'], function (exports, _aureliaBinding, _aureliaHttpClient, _breeze, _promiseAdapter, _observationAdapter, _ajaxAdapter, _errorRenderer) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _breeze2 = _interopRequireDefault(_breeze);

  function configure(frameworkConfig) {
    _breeze2['default'].config.initializeAdapterInstance('modelLibrary', 'backingStore');

    _breeze2['default'].config.setQ(_promiseAdapter.Q);

    frameworkConfig.container.get(_aureliaBinding.ObserverLocator).addAdapter(new _observationAdapter.BreezeObservationAdapter());

    frameworkConfig.container.registerTransient(_errorRenderer.ErrorRenderer, _errorRenderer.BootstrapErrorRenderer);

    frameworkConfig.globalResources('./breeze-validation');

    var adapter = _breeze2['default'].config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return frameworkConfig.container.get(_aureliaHttpClient.HttpClient);
    });
  }
});