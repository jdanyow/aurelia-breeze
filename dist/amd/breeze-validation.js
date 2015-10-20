define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-binding', './error-renderer'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaBinding, _errorRenderer) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BreezeValidation = (function () {
    function BreezeValidation(element, renderer) {
      _classCallCheck(this, _BreezeValidation);

      this.element = element;
      this.renderer = renderer;
      renderer.setRoot(element);
    }

    BreezeValidation.prototype.created = function created(view) {
      this.view = view;
    };

    BreezeValidation.prototype.isInteresting = function isInteresting(entity) {
      if (this.value.entityAspect) {
        return entity === this.value;
      }
      return this.value.getEntities().indexOf(entity) !== -1;
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
          return p.propertyName === error.propertyName;
        });
        _this.renderer.unrender(error, property);
      };

      for (var i = 0; i < removed.length; i++) {
        _loop(i);
      }

      var _loop2 = function (i) {
        var error = added[i];
        var property = _this.properties.find(function (p) {
          return p.propertyName === error.propertyName;
        });
        _this.renderer.render(error, property);
      };

      for (var i = 0; i < added.length; i++) {
        _loop2(i);
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

    BreezeValidation.prototype.subscribe = function subscribe(entityManager) {
      var _this2 = this;

      this.errorsSubscription = entityManager.validationErrorsChanged.subscribe(this.validationErrorsChanged.bind(this));
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

    BreezeValidation.prototype.unsubscribe = function unsubscribe(entityManager) {
      entityManager.validationErrorsChanged.unsubscribe(this.errorsSubscription);
      this.renderer.unrenderAll();
    };

    BreezeValidation.prototype.getEntityManager = function getEntityManager(value) {
      return value.entityAspect ? value.entityAspect.entityManager : this.value;
    };

    BreezeValidation.prototype.valueChanged = function valueChanged(newValue, oldValue) {
      if (oldValue) {
        var entityManager = this.getEntityManager(oldValue);
        this.unsubscribe(entityManager);
      }
      if (this.value) {
        var entityManager = this.getEntityManager(this.value);
        this.subscribe(entityManager);
      }
    };

    BreezeValidation.prototype.detached = function detached() {
      if (this.value) {
        var entityManager = this.getEntityManager(this.value);
        this.unsubscribe(entityManager);
      }
    };

    var _BreezeValidation = BreezeValidation;
    BreezeValidation = _aureliaDependencyInjection.inject(Element, _errorRenderer.ErrorRenderer)(BreezeValidation) || BreezeValidation;
    BreezeValidation = _aureliaTemplating.customAttribute('breeze-validation')(BreezeValidation) || BreezeValidation;
    return BreezeValidation;
  })();

  exports.BreezeValidation = BreezeValidation;
});