define(['exports', 'aurelia-binding', './expression-analyzer', './error-renderer'], function (exports, _aureliaBinding, _expressionAnalyzer, _errorRenderer) {
  'use strict';

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BreezeValidationCustomAttribute = (function () {
    _createClass(BreezeValidationCustomAttribute, null, [{
      key: 'inject',
      value: [Element, _expressionAnalyzer.ExpressionAnalyzer, _errorRenderer.ErrorRenderer],
      enumerable: true
    }]);

    function BreezeValidationCustomAttribute(element, analyzer, renderer) {
      _classCallCheck(this, BreezeValidationCustomAttribute);

      this.renderedErrors = [];

      this.element = element;
      this.renderer = renderer;
      this.analyzer = analyzer;
    }

    BreezeValidationCustomAttribute.prototype.created = function created(view) {
      this.view = view;
    };

    BreezeValidationCustomAttribute.prototype.isInteresting = function isInteresting(entity) {
      return this.value.entityAspect && entity === this.value || this.value.getEntities && this.value.getEntities().indexOf(entity) !== -1;
    };

    BreezeValidationCustomAttribute.prototype.unrenderErrors = function unrenderErrors(errors) {
      var _this = this;

      var _loop = function (i) {
        var error = errors[i];
        var entity = error.context.entity;
        var property = _this.boundProperties.find(function (p) {
          return p.propertyName === error.propertyName && p.entity === entity;
        });
        var index = _this.renderedErrors.findIndex(function (e) {
          return e.context.entity === entity && e.key === error.key;
        });
        if (index === -1) {
          return {
            v: undefined
          };
        }
        _this.renderedErrors.splice(index, 1);
        _this.renderer.unrender(_this.element, error, property);
      };

      for (var i = 0; i < errors.length; i++) {
        var _ret = _loop(i);

        if (typeof _ret === 'object') return _ret.v;
      }
    };

    BreezeValidationCustomAttribute.prototype.renderErrors = function renderErrors(errors) {
      var _this2 = this;

      var _loop2 = function (i) {
        var error = errors[i];
        var entity = error.context.entity;
        var property = _this2.boundProperties.find(function (p) {
          return p.propertyName === error.propertyName && p.entity === entity;
        });
        if (_this2.renderedErrors.find(function (e) {
          return e.context.entity === entity && e.key === error.key;
        })) {
          return {
            v: undefined
          };
        }
        _this2.renderedErrors.push(error);
        _this2.renderer.render(_this2.element, error, property);
      };

      for (var i = 0; i < errors.length; i++) {
        var _ret2 = _loop2(i);

        if (typeof _ret2 === 'object') return _ret2.v;
      }
    };

    BreezeValidationCustomAttribute.prototype.validationErrorsChanged = function validationErrorsChanged(event) {
      var entity = event.entity;
      var added = event.added;
      var removed = event.removed;

      if (!this.isInteresting(entity)) {
        return;
      }
      this.unrenderErrors(removed);
      this.renderErrors(added);
    };

    BreezeValidationCustomAttribute.prototype.subscribe = function subscribe(validationEvent) {
      var _this3 = this;

      this.validationSubscription = validationEvent.subscribe(this.validationErrorsChanged.bind(this));
      this.boundProperties = this.view.bindings.filter(function (b) {
        return b.mode === _aureliaBinding.bindingMode.twoWay && _this3.element.contains(b.targetProperty.element);
      }).map(function (b) {
        var property = _this3.analyzer.getBreezeProperty(b.sourceExpression, b.source);
        if (!property || !_this3.isInteresting(property.entity)) {
          return null;
        }
        property.element = b.targetProperty.element;
        return property;
      }).filter(function (p) {
        return p !== null;
      });
    };

    BreezeValidationCustomAttribute.prototype.unsubscribe = function unsubscribe(validationEvent) {
      validationEvent.unsubscribe(this.validationSubscription);
      this.unrenderErrors(this.renderedErrors.slice(0));
    };

    BreezeValidationCustomAttribute.prototype.getValidationEvent = function getValidationEvent(value) {
      if (value === null || value === undefined) {
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

    BreezeValidationCustomAttribute.prototype.valueChanged = function valueChanged(newValue, oldValue) {
      var validationEvent = undefined;
      if (validationEvent = this.getValidationEvent(oldValue)) {
        this.unsubscribe(validationEvent);
      }
      if (validationEvent = this.getValidationEvent(this.value)) {
        this.subscribe(validationEvent);
      }
    };

    BreezeValidationCustomAttribute.prototype.detached = function detached() {
      this.valueChanged(null, this.value);
    };

    return BreezeValidationCustomAttribute;
  })();

  exports.BreezeValidationCustomAttribute = BreezeValidationCustomAttribute;
});