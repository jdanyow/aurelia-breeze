define(["exports", "breeze-client", "aurelia-binding", "./observation-adapter", "./ajax-adapter", "./promise-adapter"], function (exports, _breezeClient, _aureliaBinding, _observationAdapter, _ajaxAdapter, _promiseAdapter) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  exports.install = install;
  var breeze = _interopRequire(_breezeClient);

  var ObjectObservationAdapter = _aureliaBinding.ObjectObservationAdapter;
  var BreezeObservationAdapter = _observationAdapter.BreezeObservationAdapter;
  var AjaxAdapter = _ajaxAdapter.AjaxAdapter;
  var Q = _promiseAdapter.Q;
  function install(aurelia) {
    breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

    aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

    breeze.config.registerAdapter("ajax", AjaxAdapter);
    breeze.config.initializeAdapterInstance("ajax", "aurelia", true);

    breeze.config.setQ(Q);
  }
  exports.__esModule = true;
});