'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ErrorRenderer = (function () {
  function ErrorRenderer() {
    _classCallCheck(this, ErrorRenderer);
  }

  ErrorRenderer.prototype.render = function render(rootElement, error, property) {
    throw new Error('An error renderer must be registered.');
  };

  ErrorRenderer.prototype.unrender = function unrender(rootElement, error, property) {
    throw new Error('An error renderer must be registered.');
  };

  return ErrorRenderer;
})();

exports.ErrorRenderer = ErrorRenderer;

var BootstrapErrorRenderer = (function () {
  function BootstrapErrorRenderer() {
    _classCallCheck(this, BootstrapErrorRenderer);
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
})();

exports.BootstrapErrorRenderer = BootstrapErrorRenderer;