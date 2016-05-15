var _dec, _class;

import breeze from 'breeze';
import { subscriberCollection, ObserverLocator } from 'aurelia-binding';
import { HttpClient } from 'aurelia-http-client';

const extend = breeze.core.extend;

export let HttpResponse = class HttpResponse {
  constructor(aureliaResponse, config) {
    this.config = config;
    this.status = aureliaResponse.statusCode;
    this.data = aureliaResponse.content;
    this.headers = aureliaResponse.headers;
  }

  getHeader(headerName) {
    if (headerName === null || headerName === undefined || headerName === '') {
      return this.headers.headers;
    }
    return this.headers.get(headerName);
  }
};

export let AjaxAdapter = class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.requestInterceptor = null;
  }

  setHttpClientFactory(createHttpClient) {
    this.createHttpClient = createHttpClient;
  }

  get httpClient() {
    return this.client || (this.client = this.createHttpClient());
  }

  initialize() {}

  ajax(config) {
    let requestInfo = {
      adapter: this,
      config: extend({}, config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient.createRequest();
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

    let request = config.request;

    request.withUrl(config.url);

    let method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();
    method = 'as' + method.charAt(0).toUpperCase() + method.slice(1);
    request[method]();

    request.withParams(config.params);

    if (config.contentType) {
      request.withHeader('Content-Type', config.contentType);
    }
    for (let header in config.headers) {
      if (config.headers.hasOwnProperty(header)) {
        request.withHeader(header, config.headers[header]);
      }
    }

    if (config.hasOwnProperty('data')) {
      request.withContent(config.data);
    }

    request.send().then(r => requestInfo.success(new HttpResponse(r, requestInfo.zConfig)), r => requestInfo.error(new HttpResponse(r, requestInfo.zConfig)));
  }
};

breeze.config.registerAdapter('ajax', AjaxAdapter);

export let Q = class Q {
  static defer() {
    return new Deferred();
  }

  static resolve(data) {
    return Promise.resolve(data);
  }

  static reject(reason) {
    return Promise.reject(reason);
  }
};

export let Deferred = class Deferred {
  constructor() {
    let self = this;
    this.promise = new Promise(function (resolve, reject) {
      self.resolve = resolve;
      self.reject = reject;
    });
  }
};

export let BreezePropertyObserver = (_dec = subscriberCollection(), _dec(_class = class BreezePropertyObserver {
  constructor(obj, propertyName) {
    this.obj = obj;
    this.propertyName = propertyName;
  }

  getValue() {
    return this.obj[this.propertyName];
  }

  setValue(newValue) {
    this.obj[this.propertyName] = newValue;
  }

  subscribe(context, callable) {
    if (this.addSubscriber(context, callable)) {
      this.oldValue = this.obj[this.propertyName];
      this.obj.__breezeObserver__.subscriberAdded();
    }
  }

  unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable)) {
      this.obj.__breezeObserver__.subscriberRemoved();
    }
  }
}) || _class);

function handleChange(change) {
  let object = change.entity;
  let propertyName = change.propertyName;
  let objectObserver = object.__breezeObserver__;
  if (propertyName === null) {
    let observers = objectObserver.observers;
    for (propertyName in observers) {
      if (observers.hasOwnProperty(propertyName)) {
        change.propertyName = propertyName;
        handleChange(change);
      }
    }
    return;
  }

  let observer = objectObserver.observers[propertyName];
  let newValue = object[propertyName];
  if (!observer || newValue === observer.oldValue) {
    return;
  }
  observer.callSubscribers(newValue, observer.oldValue);
  observer.oldValue = newValue;
}

export let BreezeObjectObserver = class BreezeObjectObserver {
  constructor(obj) {
    this.obj = obj;
    this.observers = {};
    this.subscribers = 0;
  }

  subscriberAdded() {
    if (this.subscribers === 0) {
      this.subscription = this.obj.entityAspect.propertyChanged.subscribe(handleChange);
    }

    this.subscribers++;
  }

  subscriberRemoved(propertyName, callback) {
    this.subscribers--;

    if (this.subscribers === 0) {
      this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
    }
  }

  getObserver(propertyName) {
    return this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName));
  }
};

function createObserverLookup(obj) {
  let value = new BreezeObjectObserver(obj);

  Object.defineProperty(obj, '__breezeObserver__', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

function createCanObserveLookup(entityType) {
  let value = {};
  let properties = entityType.getProperties();
  for (let i = 0, ii = properties.length; i < ii; i++) {
    let property = properties[i];

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

export let BreezeObservationAdapter = class BreezeObservationAdapter {
  getObserver(object, propertyName, descriptor) {
    let type = object.entityType;
    if (!type || !(type.__canObserve__ || createCanObserveLookup(type))[propertyName]) {
      return null;
    }

    let observerLookup = object.__breezeObserver__ || createObserverLookup(object);
    return observerLookup.getObserver(propertyName);
  }
};

export function configure(frameworkConfig) {
  breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

  breeze.config.setQ(Q);

  frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

  let adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(() => frameworkConfig.container.get(HttpClient));
}