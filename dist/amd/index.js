define(["exports", "breeze", "./promise-adapter", "aurelia-binding", "./observation-adapter", "aurelia-http-client", "./ajax-adapter"], function (exports, _breeze, _promiseAdapter, _aureliaBinding, _observationAdapter, _aureliaHttpClient, _ajaxAdapter) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  exports.install = install;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var breeze = _interopRequire(_breeze);

  var Q = _promiseAdapter.Q;
  var ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
  var BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
  var HttpClient = _aureliaHttpClient.HttpClient;

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
});