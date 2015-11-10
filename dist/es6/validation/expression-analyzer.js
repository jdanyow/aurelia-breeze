import {
  AccessMember,
  AccessScope,
  AccessKeyed,
  ValueConverter
} from 'aurelia-binding';

export class ExpressionAnalyzer {
  getBreezeProperty(expression, source) {
    if (expression instanceof ValueConverter) {
      return this.getBreezeProperty(expression.allArgs[0], source);
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
      || !entity.entityType.getProperty(propertyName)) {
      return null;
    }

    return { entity, propertyName };
  }
}
