import {ErrorRenderer} from './error-renderer';

export class BootstrapErrorRenderer extends ErrorRenderer {
  render(rootElement, error, property) {
    if (property) {
      // add the has-error class to the bootstrap form-group div
      let formGroup = property.element.closest('.form-group');
      formGroup.classList.add('has-error');

      // add help-block to the div closest to the element
      let messageContainer = property.element.closest('div:not(.input-group)');
      let message = document.createElement('span');
      message.classList.add('validation-error');
      message.error = error;
      message.classList.add('help-block');
      message.classList.add('validation-error');
      message.textContent = error.errorMessage;
      messageContainer.appendChild(message);
    }

    // get or create the alert div
    let alert = rootElement.querySelector('.validation-summary');
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
    // add the message to the alert div
    let message = document.createElement('p');
    message.classList.add('validation-error');
    message.error = error;
    message.textContent = error.errorMessage;
    alert.appendChild(message);
  }

  unrender(rootElement, error, property) {
    // remove the has-error class on the bootstrap form-group div
    if (property) {
      let formGroup = property.element.closest('.form-group');
      formGroup.classList.remove('has-error');
    }

    // remove all messages related to the error.
    let messages = rootElement.querySelectorAll('.validation-error');
    let i = messages.length;
    while(i--) {
      let message = messages[i];
      if (message.error.context.entity !== error.context.entity || message.error.key !== error.key) {
        continue;
      }
      message.error = null;
      message.remove();
    }

    // if the alert div is empty, remove it.
    let alert = rootElement.querySelector('.validation-summary');
    if (alert && alert.querySelectorAll('.validation-error').length === 0) {
      alert.remove();
    }
  }
}

// Polyfill for Element.closest and Element.matches
// https://github.com/jonathantneal/closest/
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
}(Element.prototype));
