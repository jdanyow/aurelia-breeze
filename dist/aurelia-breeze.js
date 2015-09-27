import breeze from 'breeze';
import {subscriberCollection,ObserverLocator} from 'aurelia-binding';
import {HttpClient} from 'aurelia-http-client';

var extend = breeze.core.extend;

export class HttpResponse {
  constructor(aureliaResponse, config) {
    this.config = config;
    this.status = aureliaResponse.statusCode;
    this.data = aureliaResponse.content;
    this.headers = aureliaResponse.headers;
  }

  getHeader(headerName) {
    if (headerName === null || headerName === undefined || headerName === '')
      return this.headers.headers;
    return this.headers.get(headerName);
  }
}

export class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.defaultHeaders;
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
    var requestInfo, header, method, request;

    // build the request info object.
    requestInfo = {
      adapter: this,
      config: extend({}, config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient.createRequest();
    requestInfo.config.headers = extend(extend({}, this.defaultHeaders), config.headers);

    // submit the request-info for interception.
    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
      if (!requestInfo.config)
        return;
    }
    config = requestInfo.config;

    // configure the request...
    request = config.request;

    // uri.
    request.withUrl(config.url);

    // method.
    method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();
    method = 'as' + method.charAt(0).toUpperCase() + method.slice(1);
    request[method]();

    // params.
    request.withParams(config.params);

    // headers.
    if (config.contentType) {
      request.withHeader('Content-Type', config.contentType);
    }
    for(header in config.headers) {
      if(config.headers.hasOwnProperty(header)) {
        request.withHeader(header, config.headers[header]);
      }
    }

    // content.
    if (config.hasOwnProperty('data')) {
      request.withContent(config.data);
    }

    // send the request.
    request.send()
      .then(
        r => requestInfo.success(new HttpResponse(r, requestInfo.zConfig)),
        r => requestInfo.error(new HttpResponse(r, requestInfo.zConfig))
      );
  }
}

breeze.config.registerAdapter("ajax", AjaxAdapter);

export class Q {
  static defer() {
    return new Deferred();
  }

  static resolve(data) {
    return Promise.resolve(data);
  }

  static reject(reason) {
    return Promise.reject(reason);
  }
}

export class Deferred {
  constructor() {
    var self = this;
    this.promise = new Promise(
      function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });
  }
}

@subscriberCollection()
export class BreezePropertyObserver {
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
}

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

export class BreezeObjectObserver {
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
    return this.observers[propertyName]
      || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName));
  }
}

function createObserverLookup(obj) {
  var value = new BreezeObjectObserver(obj);

  Object.defineProperty(obj, "__breezeObserver__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

function createCanObserveLookup(entityType) {
  var value = {}, properties = entityType.getProperties(), property, ii = properties.length, i;

  for(i = 0; i < ii; i++) {
    property = properties[i];

    // determine whether the adapter should handle the property...
    // all combinations of navigation/data properties * scalar/non-scalar properties are handled EXCEPT
    // non-scalar navigation properties because Aurelia handles these well natively.
    value[property.name] = property.isDataProperty || property.isScalar;
  }

  Object.defineProperty(entityType, "__canObserve__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

export class BreezeObservationAdapter {
  getObserver(object, propertyName, descriptor) {
    let type = object.entityType
    if (!type || !(type.__canObserve__ || createCanObserveLookup(type))[propertyName]) {
      return null;
    }

    let observerLookup = object.__breezeObserver__ || createObserverLookup(object);
    return observerLookup.getObserver(propertyName);
  }
}

export function configure(frameworkConfig) {
  // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // make breeze use our ES6 Promise based version of Q.
  breeze.config.setQ(Q);

  // provide aurelia with a way to observe breeze properties.
  frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

  // provide the ajax adapter with an HttpClient factory...
  // the adapter lazily gets the HttpClient instance to enable scenarios where
  // the aurelia-breeze plugin is installed prior to the HttpClient being
  // configured in the container.
  var adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(() => frameworkConfig.container.get(HttpClient));
}
