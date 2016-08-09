var _dec, _class;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



import breeze from 'breeze-client';
import { subscriberCollection, ObserverLocator } from 'aurelia-binding';
import { HttpClient } from 'aurelia-fetch-client';

var extend = breeze.core.extend;

export var HttpResponse = function () {
  function HttpResponse(aureliaResponse, config) {
    

    this.config = config;
    this.status = aureliaResponse.status;
    this.data = aureliaResponse.content;
    this.headers = aureliaResponse.headers;
  }

  HttpResponse.prototype.getHeader = function getHeader(headerName) {
    return this.getHeaders(headerName);
  };

  HttpResponse.prototype.getHeaders = function getHeaders(headerName) {
    if (headerName === null || headerName === undefined || headerName === '') {
      return this.headers.headers;
    }
    return this.headers.get(headerName);
  };

  return HttpResponse;
}();

function encodeParams(obj) {
  var query = '';
  var subValue, innerObj, fullSubName;

  for (var name in obj) {
    var value = obj[name];

    if (value instanceof Array) {
      for (var i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += encodeParams(innerObj) + '&';
      }
    } else if (value && value.toISOString) {
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value.toISOString()) + '&';
    } else if (value instanceof Object) {
      for (var subName in value) {
        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += encodeParams(innerObj) + '&';
      }
    } else if (value === null) {
      query += encodeURIComponent(name) + '=&';
    } else if (value !== undefined) {
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
};

export var AjaxAdapter = function () {
  function AjaxAdapter() {
    

    this.name = 'aurelia';
    this.requestInterceptor = null;
  }

  AjaxAdapter.prototype.setHttpClientFactory = function setHttpClientFactory(createHttpClient) {
    this.createHttpClient = createHttpClient;
  };

  AjaxAdapter.prototype.initialize = function initialize() {};

  AjaxAdapter.prototype.ajax = function ajax(config) {
    var requestInfo = {
      adapter: this,
      config: extend({}, config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient;
    requestInfo.config.headers = extend({}, config.headers);

    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
      if (!requestInfo.config) {
        return;
      }
    }

    config = requestInfo.config;
    var init = {
      method: config.type
    };

    init.headers = new Headers();
    for (var header in config.headers) {
      if (config.headers.hasOwnProperty(header)) {
        init.headers.append(header, config.headers[header]);
      }
    }

    if (config.hasOwnProperty('data')) {
      init.body = config.data;
    }

    if (config.params) {
      var delim = config.url.indexOf('?') >= 0 ? '&' : '?';
      config.url = config.url + delim + encodeParams(config.params);
    }

    if (config.contentType) {
      init.headers.append('Content-Type', config.contentType);
    }

    requestInfo.config.request.fetch(config.url, init).then(function (response) {
      var responseInput = new HttpResponse(response, requestInfo.zConfig);
      response.json().then(function (x) {
        responseInput.data = x;
        requestInfo.success(responseInput);
      }).catch(function (err) {
        responseInput.data = err;
        requestInfo.error(responseInput);
      });
    }, function (response) {
      var responseInput = new HttpResponse(response, requestInfo.zConfig);
      if (!response.json) {
        responseInput.error = response;requestInfo.error(responseInput);return;
      }
      response.json().then(function (x) {
        responseInput.data = x;
        requestInfo.error(responseInput);
      }).catch(function (err) {
        responseInput.data = err;
        requestInfo.error(responseInput);
      });
    });
  };

  _createClass(AjaxAdapter, [{
    key: 'httpClient',
    get: function get() {
      return this.client || (this.client = this.createHttpClient());
    }
  }]);

  return AjaxAdapter;
}();

breeze.config.registerAdapter('ajax', AjaxAdapter);

export var Q = function () {
  function Q() {
    
  }

  Q.defer = function defer() {
    return new Deferred();
  };

  Q.resolve = function resolve(data) {
    return Promise.resolve(data);
  };

  Q.reject = function reject(reason) {
    return Promise.reject(reason);
  };

  return Q;
}();

export var Deferred = function Deferred() {
  

  var self = this;
  this.promise = new Promise(function (resolve, reject) {
    self.resolve = resolve;
    self.reject = reject;
  });
};

export var BreezePropertyObserver = (_dec = subscriberCollection(), _dec(_class = function () {
  function BreezePropertyObserver(obj, propertyName) {
    

    this.obj = obj;
    this.propertyName = propertyName;
  }

  BreezePropertyObserver.prototype.getValue = function getValue() {
    return this.obj[this.propertyName];
  };

  BreezePropertyObserver.prototype.setValue = function setValue(newValue) {
    this.obj[this.propertyName] = newValue;
  };

  BreezePropertyObserver.prototype.subscribe = function subscribe(context, callable) {
    if (this.addSubscriber(context, callable)) {
      this.oldValue = this.obj[this.propertyName];
      this.obj.__breezeObserver__.subscriberAdded();
    }
  };

  BreezePropertyObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable)) {
      this.obj.__breezeObserver__.subscriberRemoved();
    }
  };

  return BreezePropertyObserver;
}()) || _class);

function handleChange(change) {
  var object = change.entity;
  var propertyName = change.propertyName;
  var objectObserver = object.__breezeObserver__;
  if (propertyName === null) {
    var observers = objectObserver.observers;
    for (propertyName in observers) {
      if (observers.hasOwnProperty(propertyName)) {
        change.propertyName = propertyName;
        handleChange(change);
      }
    }
    change.propertyName = null;
    return;
  }

  var observer = objectObserver.observers[propertyName];
  var newValue = object[propertyName];
  if (!observer || newValue === observer.oldValue) {
    return;
  }
  observer.callSubscribers(newValue, observer.oldValue);
  observer.oldValue = newValue;
}

export var BreezeObjectObserver = function () {
  function BreezeObjectObserver(obj) {
    

    this.obj = obj;
    this.observers = {};
    this.subscribers = 0;
  }

  BreezeObjectObserver.prototype.subscriberAdded = function subscriberAdded() {
    if (this.subscribers === 0) {
      this.subscription = this.obj.entityAspect.propertyChanged.subscribe(handleChange);
    }

    this.subscribers++;
  };

  BreezeObjectObserver.prototype.subscriberRemoved = function subscriberRemoved(propertyName, callback) {
    this.subscribers--;

    if (this.subscribers === 0) {
      this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
    }
  };

  BreezeObjectObserver.prototype.getObserver = function getObserver(propertyName) {
    return this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName));
  };

  return BreezeObjectObserver;
}();

function createObserverLookup(obj) {
  var value = new BreezeObjectObserver(obj);

  Object.defineProperty(obj, '__breezeObserver__', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

function createCanObserveLookup(entityType) {
  var value = {};
  var properties = entityType.getProperties();
  for (var i = 0, ii = properties.length; i < ii; i++) {
    var property = properties[i];

    value[property.name] = property.isDataProperty || property.isScalar;
  }

  Object.defineProperty(entityType, '__canObserve__', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

export var BreezeObservationAdapter = function () {
  function BreezeObservationAdapter() {
    
  }

  BreezeObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
    var type = object.entityType;
    if (!type || !(type.__canObserve__ || createCanObserveLookup(type))[propertyName]) {
      return null;
    }

    var observerLookup = object.__breezeObserver__ || createObserverLookup(object);
    return observerLookup.getObserver(propertyName);
  };

  return BreezeObservationAdapter;
}();

export function configure(frameworkConfig) {
  breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

  breeze.config.setQ(Q);

  frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

  var adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(function () {
    return frameworkConfig.container.get(HttpClient);
  });
}