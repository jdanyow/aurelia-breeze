"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.install = install;
var breeze = _interopRequire(require("breeze"));

var ObjectObservationAdapter = require("aurelia-binding").ObjectObservationAdapter;
var HttpClient = require("aurelia-http-client").HttpClient;
var BreezeObservationAdapter = require("./observation-adapter").BreezeObservationAdapter;
var _ajaxAdapter = require("./ajax-adapter");

var AjaxAdapter = _ajaxAdapter.AjaxAdapter;
var setHttpClientFactory = _ajaxAdapter.setHttpClientFactory;
var Q = require("./promise-adapter").Q;
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
exports.__esModule = true;