define(['exports', 'aurelia-dependency-injection'], function (exports, _aureliaDependencyInjection) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ErrorRenderer = (function () {
    function ErrorRenderer() {
      _classCallCheck(this, ErrorRenderer);
    }

    ErrorRenderer.prototype.setRoot = function setRoot(element) {
      throw new Error('An error renderer must be registered.');
    };

    ErrorRenderer.prototype.render = function render(validationError, property) {
      throw new Error('An error renderer must be registered.');
    };

    ErrorRenderer.prototype.unrender = function unrender(validationError, property) {
      throw new Error('An error renderer must be registered.');
    };

    ErrorRenderer.prototype.unrenderAll = function unrenderAll() {
      throw new Error('An error renderer must be registered.');
    };

    return ErrorRenderer;
  })();

  exports.ErrorRenderer = ErrorRenderer;

  var BootstrapErrorRenderer = (function () {
    function BootstrapErrorRenderer() {
      _classCallCheck(this, _BootstrapErrorRenderer);

      this.propertyErrors = new Map();
      this.entityErrors = new Map();
    }

    BootstrapErrorRenderer.prototype.setRoot = function setRoot(element) {
      this.element = element;
    };

    BootstrapErrorRenderer.prototype.render = function render(error, property) {
      if (property) {
        if (!this.propertyErrors.has(error.key)) {
          var formGroup = property.element.closest('.form-group');
          formGroup.classList.add('has-error');

          var messageContainer = property.element.closest('div:not(.input-group)');
          var message = document.createElement('span');
          message.classList.add('help-block');
          message.textContent = error.errorMessage;
          messageContainer.appendChild(message);

          this.propertyErrors.set(error.key, { formGroup: formGroup, messageContainer: messageContainer, message: message });
        }
      }

      if (!this.entityErrors.has(error.key)) {
        var _alert = this.alert;
        if (!_alert) {
          _alert = document.createElement('div');
          _alert.setAttribute('role', 'alert');
          _alert.classList.add('alert');
          _alert.classList.add('alert-danger');
          if (this.element.firstChild) {
            this.element.insertBefore(_alert, this.element.firstChild);
          } else {
            this.element.appendChild(_alert);
          }
          this.alert = _alert;
        }

        var message = document.createElement('p');
        message.textContent = error.errorMessage;
        _alert.appendChild(message);

        this.entityErrors.set(error.key, message);
      }
    };

    BootstrapErrorRenderer.prototype.unrender = function unrender(error, property) {
      if (this.propertyErrors.has(error.key)) {
        var _propertyErrors$get = this.propertyErrors.get(error.key);

        var formGroup = _propertyErrors$get.formGroup;
        var messageContainer = _propertyErrors$get.messageContainer;
        var message = _propertyErrors$get.message;

        this.propertyErrors['delete'](error.key);
        formGroup.classList.remove('has-error');
        messageContainer.removeChild(message);
      }
      if (this.entityErrors.has(error.key)) {
        var message = this.entityErrors.get(error.key);
        this.entityErrors['delete'](error.key);
        this.alert.removeChild(message);
        if (this.entityErrors.size === 0) {
          this.element.removeChild(this.alert);
          this.alert = null;
        }
      }
    };

    BootstrapErrorRenderer.prototype.unrenderAll = function unrenderAll() {
      for (var _iterator = this.entityErrors, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        if (_isArray) {
          if (_i >= _iterator.length) break;
          var _iterator2 = _iterator[_i++];
          error = _iterator2[0];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          var _i$value = _i.value;
          error = _i$value[0];
        }

        this.unrender(error);
      }
    };

    var _BootstrapErrorRenderer = BootstrapErrorRenderer;
    BootstrapErrorRenderer = _aureliaDependencyInjection.transient()(BootstrapErrorRenderer) || BootstrapErrorRenderer;
    return BootstrapErrorRenderer;
  })();

  exports.BootstrapErrorRenderer = BootstrapErrorRenderer;
});