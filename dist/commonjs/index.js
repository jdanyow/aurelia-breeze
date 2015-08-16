'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _breeze = require('breeze');

var _breeze2 = _interopRequireDefault(_breeze);

var _promiseAdapter = require('./promise-adapter');

var _aureliaBinding = require('aurelia-binding');

var _observationAdapter = require('./observation-adapter');

var _aureliaHttpClient = require('aurelia-http-client');

require('./ajax-adapter');

function configure(frameworkConfig) {
  _breeze2['default'].config.initializeAdapterInstance('modelLibrary', 'backingStore');

  _breeze2['default'].config.setQ(_promiseAdapter.Q);

  frameworkConfig.instance(_aureliaBinding.ObjectObservationAdapter, new _observationAdapter.BreezeObservationAdapter());

  var adapter = _breeze2['default'].config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(function () {
    return frameworkConfig.container.get(_aureliaHttpClient.HttpClient);
  });
}