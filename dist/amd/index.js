define(["exports", "breeze", "aurelia-binding", "aurelia-http-client", "./observation-adapter", "./ajax-adapter", "./promise-adapter"], function (exports, _breeze, _aureliaBinding, _aureliaHttpClient, _observationAdapter, _ajaxAdapter, _promiseAdapter) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  exports.install = install;
  var breeze = _interopRequire(_breeze);

  var ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
  var HttpClient = _aureliaHttpClient.HttpClient;
  var BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
  var AjaxAdapter = _ajaxAdapter.AjaxAdapter;
  var setHttpClientFactory = _ajaxAdapter.setHttpClientFactory;
  var Q = _promiseAdapter.Q;
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});