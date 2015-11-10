System.register(['./error-renderer'], function (_export) {
  'use strict';

  var ErrorRenderer, BootstrapErrorRenderer;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  return {
    setters: [function (_errorRenderer) {
      ErrorRenderer = _errorRenderer.ErrorRenderer;
    }],
    execute: function () {
      BootstrapErrorRenderer = (function (_ErrorRenderer) {
        _inherits(BootstrapErrorRenderer, _ErrorRenderer);

        function BootstrapErrorRenderer() {
          _classCallCheck(this, BootstrapErrorRenderer);

          _ErrorRenderer.apply(this, arguments);
        }

        BootstrapErrorRenderer.prototype.render = function render(rootElement, error, property) {
          if (property) {
            var formGroup = property.element.closest('.form-group');
            formGroup.classList.add('has-error');

            var messageContainer = property.element.closest('div:not(.input-group)');
            var _message = document.createElement('span');
            _message.classList.add('validation-error');
            _message.error = error;
            _message.classList.add('help-block');
            _message.classList.add('validation-error');
            _message.textContent = error.errorMessage;
            messageContainer.appendChild(_message);
          }

          var alert = rootElement.querySelector('.validation-summary');
          if (!alert) {
            alert = document.createElement('div');
            alert.setAttribute('role', 'alert');
            alert.classList.add('alert');
            alert.classList.add('alert-danger');
            alert.classList.add('validation-summary');
            if (rootElement.firstChild) {
              rootElement.insertBefore(alert, rootElement.firstChild);
            } else {
              rootElement.appendChild(alert);
            }
          }

          var message = document.createElement('p');
          message.classList.add('validation-error');
          message.error = error;
          message.textContent = error.errorMessage;
          alert.appendChild(message);
        };

        BootstrapErrorRenderer.prototype.unrender = function unrender(rootElement, error, property) {
          if (property) {
            var formGroup = property.element.closest('.form-group');
            formGroup.classList.remove('has-error');
          }

          var messages = rootElement.querySelectorAll('.validation-error');
          var i = messages.length;
          while (i--) {
            var message = messages[i];
            if (message.error.context.entity !== error.context.entity || message.error.key !== error.key) {
              continue;
            }
            message.error = null;
            message.remove();
          }

          var alert = rootElement.querySelector('.validation-summary');
          if (alert && alert.querySelectorAll('.validation-error').length === 0) {
            alert.remove();
          }
        };

        return BootstrapErrorRenderer;
      })(ErrorRenderer);

      _export('BootstrapErrorRenderer', BootstrapErrorRenderer);

      (function (ELEMENT) {
        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
          var element = this;

          while (element) {
            if (element.matches(selector)) {
              break;
            }

            element = element.parentElement;
          }

          return element;
        };
      })(Element.prototype);
    }
  };
});