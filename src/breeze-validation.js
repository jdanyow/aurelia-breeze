import {customAttribute} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {
  bindingMode,
  AccessMember,
  AccessScope,
  AccessKeyed,
  ValueConverter
} from 'aurelia-binding';
import {ErrorRenderer} from './error-renderer';

@customAttribute('breeze-validation')
@inject(Element, ErrorRenderer)
export class BreezeValidation {
  errors = [];
  view;
  element;
  renderer;
  errorsSubscription;
  properties;

  constructor(element, renderer) {
    this.element = element;
    this.renderer = renderer;
  }

  created(view) {
    this.view = view;
  }

  isInteresting(entity) {
    return this.value.entityAspect && entity === this.value // this.value is the entity
      || this.value.getEntities && this.value.getEntities().indexOf(entity) !== -1; // this.value is the EntityManager that contains the entity.
  }

  validationErrorsChanged(event) {
    let { entity, added, removed } = event;
    if (!this.isInteresting(entity)) {
      return;
    }
    for (let i = 0; i < removed.length; i++) {
      let error = removed[i];
      let property = this.properties.find(p => p.propertyName === error.propertyName && p.entity === entity);
      let index = this.errors.findIndex(e => e.context.entity === entity && e.key === error.key);
      if (index === -1) {
        return;
      }
      this.errors.splice(index, 1);
      this.renderer.unrender(this.element, error, property);
    }
    for (let i = 0; i < added.length; i++) {
      let error = added[i];
      let property = this.properties.find(p => p.propertyName === error.propertyName && p.entity === entity);
      if (this.errors.find(e => e.context.entity === entity && e.key === error.key)) {
        return;
      }
      this.errors.push(error);
      this.renderer.render(this.element, error, property);
    }
  }

  getEntityProperty(expression, source) {
    if (expression instanceof ValueConverter) {
      return this.getEntityProperty(expression.allArgs[0], source);
    }

    let entity;
    let propertyName;
    if (expression instanceof AccessScope) {
      if (!source.entityAspect) {
        return null;
      }
      entity = source;
      propertyName = expression.name;
    }
    if (expression instanceof AccessMember) {
      entity = expression.object.evaluate(source);
      if (!entity || !entity.entityAspect) {
        return null;
      }
      propertyName = expression.name;
    }
    if (expression instanceof AccessKeyed) {
      entity = expression.object.evaluate(source);
      if (!entity || !entity.entityAspect) {
        return null;
      }
      propertyName = expression.key.evaluate(source);
    }

    if (propertyName === null
      || propertyName === undefined
      || !entity.entityType.getProperty(propertyName)
      || !this.isInteresting(entity)) {
      return null;
    }

    return { entity, propertyName };
  }

  subscribe(errorsChangedEvent) {
    this.errorsSubscription = errorsChangedEvent.subscribe(::this.validationErrorsChanged);
    this.properties = this.view.bindings
      .filter(b => b.mode === bindingMode.twoWay && this.element.contains(b.targetProperty.element))  // potentially unsafe...
      .map(b => {
        let property = this.getEntityProperty(b.sourceExpression, b.source);
        if (!property) {
          return null;
        }
        property.element = b.targetProperty.element;
        return property;
      })
      .filter(p => p !== null);
  }

  unsubscribe(errorsChangedEvent) {
    errorsChangedEvent.unsubscribe(this.errorsSubscription);
    let i = this.errors.length;
    while(i--) {
      this.renderer.unrender(this.element, this.errors[i]);
    }
    this.errors.splice(0, this.errors.length);
  }

  getErrorsChangedEvent(value) {
    if (!value) {
      return null;
    }
    if (value.validationErrorsChanged) {
      // value is an EntityManager
      return value.validationErrorsChanged;
    }
    if (value.entityAspect) {
      // value is an Entity
      return value.entityAspect.validationErrorsChanged;
    }
    return null;
  }

  valueChanged(newValue, oldValue) {
    let errorsChangedEvent;
    if (errorsChangedEvent = this.getErrorsChangedEvent(oldValue)) {
      this.unsubscribe(errorsChangedEvent);
    }
    if (errorsChangedEvent = this.getErrorsChangedEvent(this.value)) {
      this.subscribe(errorsChangedEvent);
    }
  }

  detached() {
    this.valueChanged(null, this.value);
  }
}
