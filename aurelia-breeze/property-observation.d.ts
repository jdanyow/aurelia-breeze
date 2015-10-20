declare module 'aurelia-breeze' {
  import { subscriberCollection }  from 'aurelia-binding';
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
}