define(['exports', 'breeze', './promise-adapter', 'aurelia-binding', './observation-adapter', 'aurelia-http-client', './ajax-adapter'], function (exports, _breeze, _promiseAdapter, _aureliaBinding, _observationAdapter, _aureliaHttpClient, _ajaxAdapter) {
  'use strict';

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  exports.__esModule = true;
  exports.configure = configure;

  var _breeze2 = _interopRequire(_breeze);

  function configure(aurelia) {
    _breeze2.config.initializeAdapterInstance('modelLibrary', 'backingStore');

    _breeze2.config.setQ(_promiseAdapter.Q);

    aurelia.withInstance(_aureliaBinding.ObjectObservationAdapter, new _observationAdapter.BreezeObservationAdapter());

    var adapter = _breeze2.config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return aurelia.container.get(_aureliaHttpClient.HttpClient);
    });
  }
});