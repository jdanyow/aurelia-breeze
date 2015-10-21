declare module 'aurelia-breeze' {
  import { customAttribute }  from 'aurelia-templating';
  import { inject }  from 'aurelia-dependency-injection';
  import { bindingMode, AccessMember, AccessScope, AccessKeyed, ValueConverter }  from 'aurelia-binding';
  import { ErrorRenderer }  from 'aurelia-breeze/error-renderer';
  export class BreezeValidation {
    errors: any;
    view: any;
    element: any;
    renderer: any;
    errorsSubscription: any;
    properties: any;
    constructor(element: any, renderer: any);
    created(view: any): any;
    isInteresting(entity: any): any;
    
    //  this.value is the EntityManager that contains the entity.
    validationErrorsChanged(event: any): any;
    getEntityProperty(expression: any, source: any): any;
    subscribe(errorsChangedEvent: any): any;
    unsubscribe(errorsChangedEvent: any): any;
    getErrorsChangedEvent(value: any): any;
    valueChanged(newValue: any, oldValue: any): any;
    detached(): any;
  }
}