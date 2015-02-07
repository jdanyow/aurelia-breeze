"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.install = install;
var breeze = _interopRequire(require("breeze-client"));

var ObjectObservationAdapter = require("aurelia-binding").ObjectObservationAdapter;
var BreezeObservationAdapter = require("./observation-adapter").BreezeObservationAdapter;
var AjaxAdapter = require("./ajax-adapter").AjaxAdapter;
var Q = require("./promise-adapter").Q;
function install(aurelia) {
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

  breeze.config.registerAdapter("ajax", AjaxAdapter);
  breeze.config.initializeAdapterInstance("ajax", "aurelia", true);

  breeze.config.setQ(Q);
}
exports.__esModule = true;