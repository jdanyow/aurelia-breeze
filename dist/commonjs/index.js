"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var breeze = _interopRequire(require("breeze"));

var Q = require("./promise-adapter").Q;

var ObjectObservationAdapter = require("aurelia-binding").ObjectObservationAdapter;

var BreezeObservationAdapter = require("./observation-adapter").BreezeObservationAdapter;

var HttpClient = require("aurelia-http-client").HttpClient;

require("./ajax-adapter");

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