declare module 'aurelia-breeze' {
  import { ObserverLocator }  from 'aurelia-binding';
  import { HttpClient }  from 'aurelia-http-client';
  import breeze from 'breeze';
  import { Q }  from 'aurelia-breeze/promise-adapter';
  import { BreezeObservationAdapter }  from 'aurelia-breeze/observation-adapter';
  import { AjaxAdapter }  from 'aurelia-breeze/ajax-adapter';
  
  // eslint-disable-line no-unused-vars
  import { ErrorRenderer, BootstrapErrorRenderer }  from 'aurelia-breeze/error-renderer';
  export function configure(frameworkConfig: any): any;
}