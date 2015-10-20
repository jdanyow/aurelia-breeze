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
  view;
  element;
  renderer;
  errorsSubscription;
  properties;

  constructor(element, renderer) {
    this.element = element;
    this.renderer = renderer;
    renderer.setRoot(element);
  }

  created(view) {
    this.view = view;
  }

  isInteresting(entity) {
    if (this.value.entityAspect) {
      return entity === this.value;
    }
    return this.value.getEntities().indexOf(entity) !== -1;
  }

  validationErrorsChanged(event) {
    let { entity, added, removed } = event;
    if (!this.isInteresting(entity)) {
      return;
    }
    for (let i = 0; i < removed.length; i++) {
      let error = removed[i];
      let property = this.properties.find(p => p.propertyName === error.propertyName);
      this.renderer.unrender(error, property);
    }
    for (let i = 0; i < added.length; i++) {
      let error = added[i];
      let property = this.properties.find(p => p.propertyName === error.propertyName);
      this.renderer.render(error, property);
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

  subscribe(entityManager) {
    this.errorsSubscription = entityManager.validationErrorsChanged.subscribe(::this.validationErrorsChanged);
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

  unsubscribe(entityManager) {
    entityManager.validationErrorsChanged.unsubscribe(this.errorsSubscription);
    this.renderer.unrenderAll();
  }

  getEntityManager(value) {
    return value.entityAspect ? value.entityAspect.entityManager : this.value;
  }

  valueChanged(newValue, oldValue) {
    if (oldValue) {
      let entityManager = this.getEntityManager(oldValue);
      this.unsubscribe(entityManager);
    }
    if (this.value) {
      let entityManager = this.getEntityManager(this.value);
      this.subscribe(entityManager);
    }
  }

  detached() {
    if (this.value) {
      let entityManager = this.getEntityManager(this.value);
      this.unsubscribe(entityManager);
    }
  }
}
