declare module 'aurelia-breeze' {
  import { transient }  from 'aurelia-dependency-injection';
  export class ErrorRenderer {
    setRoot(element: any): any;
    render(validationError: any, property: any): any;
    unrender(validationError: any, property: any): any;
    unrenderAll(): any;
  }
  export class BootstrapErrorRenderer {
    propertyErrors: any;
    entityErrors: any;
    setRoot(element: any): any;
    render(error: any, property: any): any;
    unrender(error: any, property: any): any;
    unrenderAll(): any;
  }
}