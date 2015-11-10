import {bindingMode} from 'aurelia-binding';
import {ExpressionAnalyzer} from './expression-analyzer';
import {ErrorRenderer} from './error-renderer';

export class BreezeValidationCustomAttribute {
  static inject = [Element, ExpressionAnalyzer, ErrorRenderer];

  element;
  analyzer;
  renderer;
  view;
  validationSubscription;
  boundProperties;
  renderedErrors = [];

  constructor(element, analyzer, renderer) {
    this.element = element;
    this.renderer = renderer;
    this.analyzer = analyzer;
  }

  created(view) {
    this.view = view;
  }

  isInteresting(entity) {
    return this.value.entityAspect && entity === this.value // this.value is the entity
      || this.value.getEntities && this.value.getEntities().indexOf(entity) !== -1; // this.value is the EntityManager that contains the entity.
  }

  unrenderErrors(errors) {
    for (let i = 0; i < errors.length; i++) {
      let error = errors[i];
      let entity = error.context.entity;
      let property = this.boundProperties.find(p => p.propertyName === error.propertyName && p.entity === entity);
      let index = this.renderedErrors.findIndex(e => e.context.entity === entity && e.key === error.key);
      if (index === -1) {
        return;
      }
      this.renderedErrors.splice(index, 1);
      this.renderer.unrender(this.element, error, property);
    }
  }

  renderErrors(errors) {
    for (let i = 0; i < errors.length; i++) {
      let error = errors[i];
      let entity = error.context.entity;
      let property = this.boundProperties.find(p => p.propertyName === error.propertyName && p.entity === entity);
      if (this.renderedErrors.find(e => e.context.entity === entity && e.key === error.key)) {
        return;
      }
      this.renderedErrors.push(error);
      this.renderer.render(this.element, error, property);
    }
  }

  validationErrorsChanged(event) {
    let { entity, added, removed } = event;
    if (!this.isInteresting(entity)) {
      return;
    }
    this.unrenderErrors(removed);
    this.renderErrors(added);
  }

  subscribe(validationEvent) {
    this.validationSubscription = validationEvent.subscribe(::this.validationErrorsChanged);
    this.boundProperties = this.view.bindings
      .filter(b => b.mode === bindingMode.twoWay && this.element.contains(b.targetProperty.element))  // potentially unsafe...
      .map(b => {
        let property = this.analyzer.getBreezeProperty(b.sourceExpression, b.source);
        if (!property || !this.isInteresting(property.entity)) {
          return null;
        }
        property.element = b.targetProperty.element;
        return property;
      })
      .filter(p => p !== null);
  }

  unsubscribe(validationEvent) {
    validationEvent.unsubscribe(this.validationSubscription);
    this.unrenderErrors(this.renderedErrors.slice(0));
  }

  getValidationEvent(value) {
    // nothing?
    if (value === null || value === undefined) {
      return null;
    }
    // EntityManager?
    if (value.validationErrorsChanged) {
      return value.validationErrorsChanged;
    }
    // Entity?
    if (value.entityAspect) {
      return value.entityAspect.validationErrorsChanged;
    }
    // something else?  This can happen when someone binds to an object that doesn't exist.
    // Aurelia's AccessMember class will create the object automatically.
    return null;
  }

  valueChanged(newValue, oldValue) {
    let validationEvent;
    if (validationEvent = this.getValidationEvent(oldValue)) {
      this.unsubscribe(validationEvent);
    }
    if (validationEvent = this.getValidationEvent(this.value)) {
      this.subscribe(validationEvent);
    }
  }

  detached() {
    this.valueChanged(null, this.value);
  }
}
