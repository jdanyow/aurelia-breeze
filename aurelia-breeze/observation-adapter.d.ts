declare module 'aurelia-breeze' {
  import { BreezeObjectObserver }  from 'aurelia-breeze/property-observation';
  export class BreezeObservationAdapter {
    getObserver(object: any, propertyName: any, descriptor: any): any;
  }
}