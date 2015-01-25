"use strict";

exports.install = install;
exports.install = require("./observation-adapter").install;
exports.BreezeObservationAdapter = require("./observation-adapter").BreezeObservationAdapter;
exports.BreezeObjectObserver = require("./property-observation").BreezeObjectObserver;
exports.BreezePropertyObserver = require("./property-observation").BreezePropertyObserver;
function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationdapter());
}