define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-binding', './error-renderer'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaBinding, _errorRenderer) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BreezeValidation = (function () {
    function BreezeValidation(element, renderer) {
      _classCallCheck(this, _BreezeValidation);

      this.errors = [];

      this.element = element;
      this.renderer = renderer;
    }

    BreezeValidation.prototype.created = function created(view) {
      this.view = view;
    };

    BreezeValidation.prototype.isInteresting = function isInteresting(entity) {
      return this.value.entityAspect && entity === this.value || this.value.getEntities && this.value.getEntities().indexOf(entity) !== -1;
    };

    BreezeValidation.prototype.validationErrorsChanged = function validationErrorsChanged(event) {
      var _this = this;

      var entity = event.entity;
      var added = event.added;
      var removed = event.removed;

      if (!this.isInteresting(entity)) {
        return;
      }

      var _loop = function (i) {
        var error = removed[i];
        var property = _this.properties.find(function (p) {
          return p.propertyName === error.propertyName && p.entity === entity;
        });
        var index = _this.errors.findIndex(function (e) {
          return e.context.entity === entity && e.key === error.key;
        });
        if (index === -1) {
          return {
            v: undefined
          };
        }
        _this.errors.splice(index, 1);
        _this.renderer.unrender(_this.element, error, property);
      };

      for (var i = 0; i < removed.length; i++) {
        var _ret = _loop(i);

        if (typeof _ret === 'object') return _ret.v;
      }

      var _loop2 = function (i) {
        var error = added[i];
        var property = _this.properties.find(function (p) {
          return p.propertyName === error.propertyName && p.entity === entity;
        });
        if (_this.errors.find(function (e) {
          return e.context.entity === entity && e.key === error.key;
        })) {
          return {
            v: undefined
          };
        }
        _this.errors.push(error);
        _this.renderer.render(_this.element, error, property);
      };

      for (var i = 0; i < added.length; i++) {
        var _ret2 = _loop2(i);

        if (typeof _ret2 === 'object') return _ret2.v;
      }
    };

    BreezeValidation.prototype.getEntityProperty = function getEntityProperty(expression, source) {
      if (expression instanceof _aureliaBinding.ValueConverter) {
        return this.getEntityProperty(expression.allArgs[0], source);
      }

      var entity = undefined;
      var propertyName = undefined;
      if (expression instanceof _aureliaBinding.AccessScope) {
        if (!source.entityAspect) {
          return null;
        }
        entity = source;
        propertyName = expression.name;
      }
      if (expression instanceof _aureliaBinding.AccessMember) {
        entity = expression.object.evaluate(source);
        if (!entity || !entity.entityAspect) {
          return null;
        }
        propertyName = expression.name;
      }
      if (expression instanceof _aureliaBinding.AccessKeyed) {
        entity = expression.object.evaluate(source);
        if (!entity || !entity.entityAspect) {
          return null;
        }
        propertyName = expression.key.evaluate(source);
      }

      if (propertyName === null || propertyName === undefined || !entity.entityType.getProperty(propertyName) || !this.isInteresting(entity)) {
        return null;
      }

      return { entity: entity, propertyName: propertyName };
    };

    BreezeValidation.prototype.subscribe = function subscribe(errorsChangedEvent) {
      var _this2 = this;

      this.errorsSubscription = errorsChangedEvent.subscribe(this.validationErrorsChanged.bind(this));
      this.properties = this.view.bindings.filter(function (b) {
        return b.mode === _aureliaBinding.bindingMode.twoWay && _this2.element.contains(b.targetProperty.element);
      }).map(function (b) {
        var property = _this2.getEntityProperty(b.sourceExpression, b.source);
        if (!property) {
          return null;
        }
        property.element = b.targetProperty.element;
        return property;
      }).filter(function (p) {
        return p !== null;
      });
    };

    BreezeValidation.prototype.unsubscribe = function unsubscribe(errorsChangedEvent) {
      errorsChangedEvent.unsubscribe(this.errorsSubscription);
      var i = this.errors.length;
      while (i--) {
        this.renderer.unrender(this.element, this.errors[i]);
      }
      this.errors.splice(0, this.errors.length);
    };

    BreezeValidation.prototype.getErrorsChangedEvent = function getErrorsChangedEvent(value) {
      if (!value) {
        return null;
      }
      if (value.validationErrorsChanged) {
        return value.validationErrorsChanged;
      }
      if (value.entityAspect) {
        return value.entityAspect.validationErrorsChanged;
      }
      return null;
    };

    BreezeValidation.prototype.valueChanged = function valueChanged(newValue, oldValue) {
      var errorsChangedEvent = undefined;
      if (errorsChangedEvent = this.getErrorsChangedEvent(oldValue)) {
        this.unsubscribe(errorsChangedEvent);
      }
      if (errorsChangedEvent = this.getErrorsChangedEvent(this.value)) {
        this.subscribe(errorsChangedEvent);
      }
    };

    BreezeValidation.prototype.detached = function detached() {
      this.valueChanged(null, this.value);
    };

    var _BreezeValidation = BreezeValidation;
    BreezeValidation = _aureliaDependencyInjection.inject(Element, _errorRenderer.ErrorRenderer)(BreezeValidation) || BreezeValidation;
    BreezeValidation = _aureliaTemplating.customAttribute('breeze-validation')(BreezeValidation) || BreezeValidation;
    return BreezeValidation;
  })();

  exports.BreezeValidation = BreezeValidation;
});