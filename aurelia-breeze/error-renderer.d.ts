declare module 'aurelia-breeze' {
  export class ErrorRenderer {
    render(rootElement: any, error: any, property: any): any;
    unrender(rootElement: any, error: any, property: any): any;
  }
  export class BootstrapErrorRenderer {
    render(rootElement: any, error: any, property: any): any;
    unrender(rootElement: any, error: any, property: any): any;
  }
}