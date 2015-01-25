"use strict";

exports.install = install;
var ObjectObservationAdapter = require("aurelia-binding").ObjectObservationAdapter;
exports.install = require("./observation-adapter").install;
exports.BreezeObservationAdapter = require("./observation-adapter").BreezeObservationAdapter;
exports.BreezeObjectObserver = require("./property-observation").BreezeObjectObserver;
exports.BreezePropertyObserver = require("./property-observation").BreezePropertyObserver;
function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
}