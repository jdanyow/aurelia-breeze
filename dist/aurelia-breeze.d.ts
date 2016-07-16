import breeze from 'breeze-client';
import {
  subscriberCollection,
  ObserverLocator
} from 'aurelia-binding';
import {
  HttpClient
} from 'aurelia-fetch-client';
export declare class HttpResponse {
  constructor(aureliaResponse?: any, config?: any);
  getHeader(headerName?: any): any;
  getHeaders(headerName?: any): any;
}
export declare class AjaxAdapter {
  constructor();
  setHttpClientFactory(createHttpClient?: any): any;
  httpClient: any;
  initialize(): any;
  ajax(config?: any): any;
}
export declare class Q {
  static defer(): any;
  static resolve(data?: any): any;
  static reject(reason?: any): any;
}
export declare class Deferred {
  constructor();
}
export declare class BreezePropertyObserver {
  constructor(obj?: any, propertyName?: any);
  getValue(): any;
  setValue(newValue?: any): any;
  subscribe(context?: any, callable?: any): any;
  unsubscribe(context?: any, callable?: any): any;
}
export declare class BreezeObjectObserver {
  constructor(obj?: any);
  subscriberAdded(): any;
  subscriberRemoved(propertyName?: any, callback?: any): any;
  getObserver(propertyName?: any): any;
}
export declare class BreezeObservationAdapter {
  getObserver(object?: any, propertyName?: any, descriptor?: any): any;
}

//eslint-disable-line no-unused-vars
export declare function configure(frameworkConfig?: any): any;