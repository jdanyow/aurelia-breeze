declare module 'aurelia-breeze' {
  export class Q {
    static defer(): any;
    static resolve(data: any): any;
    static reject(reason: any): any;
  }
  export class Deferred {
    constructor();
  }
}