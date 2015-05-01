'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;

var _breeze = require('breeze');

var _breeze2 = _interopRequireWildcard(_breeze);

var _Q = require('./promise-adapter');

var _ObjectObservationAdapter = require('aurelia-binding');

var _BreezeObservationAdapter = require('./observation-adapter');

var _HttpClient = require('aurelia-http-client');

require('./ajax-adapter');

function configure(aurelia) {
  _breeze2['default'].config.initializeAdapterInstance('modelLibrary', 'backingStore');

  _breeze2['default'].config.setQ(_Q.Q);

  aurelia.withInstance(_ObjectObservationAdapter.ObjectObservationAdapter, new _BreezeObservationAdapter.BreezeObservationAdapter());

  var adapter = _breeze2['default'].config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(function () {
    return aurelia.container.get(_HttpClient.HttpClient);
  });
}