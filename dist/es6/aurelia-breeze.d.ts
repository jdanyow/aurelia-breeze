declare module 'aurelia-breeze' {
  import breeze from 'breeze';
  import { subscriberCollection, ObserverLocator }  from 'aurelia-binding';
  import { HttpClient }  from 'aurelia-http-client';
  export class HttpResponse {
    constructor(aureliaResponse: any, config: any);
    getHeader(headerName: any): any;
  }
  export class AjaxAdapter {
    constructor();
    setHttpClientFactory(createHttpClient: any): any;
    httpClient: any;
    initialize(): any;
    ajax(config: any): any;
  }
  export class Q {
    static defer(): any;
    static resolve(data: any): any;
    static reject(reason: any): any;
  }
  export class Deferred {
    constructor();
  }
  export class BreezePropertyObserver {
    constructor(obj: any, propertyName: any);
    getValue(): any;
    setValue(newValue: any): any;
    subscribe(context: any, callable: any): any;
    unsubscribe(context: any, callable: any): any;
  }
  export class BreezeObjectObserver {
    constructor(obj: any);
    subscriberAdded(): any;
    subscriberRemoved(propertyName: any, callback: any): any;
    getObserver(propertyName: any): any;
  }
  export class BreezeObservationAdapter {
    getObserver(object: any, propertyName: any, descriptor: any): any;
  }
  export function configure(frameworkConfig: any): any;
}