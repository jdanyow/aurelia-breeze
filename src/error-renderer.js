import {transient} from 'aurelia-dependency-injection';

export class ErrorRenderer {
  setRoot(element) {
    throw new Error('An error renderer must be registered.');
  }
  render(validationError, property) {
    throw new Error('An error renderer must be registered.');
  }
  unrender(validationError, property) {
    throw new Error('An error renderer must be registered.');
  }
  unrenderAll() {
    throw new Error('An error renderer must be registered.');
  }
}

@transient()
export class BootstrapErrorRenderer {
  propertyErrors = new Map();
  entityErrors = new Map();

  setRoot(element) {
    this.element = element;
  }

  render(error, property) {
    if (property) {
      // already rendered?
      if (!this.propertyErrors.has(error.key)) {
        // add the has-error class to the bootstrap form-group div
        let formGroup = property.element.closest('.form-group');
        formGroup.classList.add('has-error');

        // add help-block to the div closest to the element
        let messageContainer = property.element.closest('div:not(.input-group)');
        let message = document.createElement('span');
        message.classList.add('help-block');
        message.textContent = error.errorMessage;
        messageContainer.appendChild(message);

        // track the rendered error
        this.propertyErrors.set(error.key, { formGroup, messageContainer, message });
      }
    }

    // already rendered?
    if (!this.entityErrors.has(error.key)) {
      // get or create the alert div
      let alert = this.alert;
      if (!alert) {
        alert = document.createElement('div');
        alert.setAttribute('role', 'alert');
        alert.classList.add('alert');
        alert.classList.add('alert-danger');
        if (this.element.firstChild) {
          this.element.insertBefore(alert, this.element.firstChild);
        } else {
          this.element.appendChild(alert);
        }
        this.alert = alert;
      }
      // add the message to the alert div
      let message = document.createElement('p');
      message.textContent = error.errorMessage;
      alert.appendChild(message);

      // track the rendered error
      this.entityErrors.set(error.key, message);
    }
  }

  unrender(error, property) {
    if (this.propertyErrors.has(error.key)) {
      let { formGroup, messageContainer, message } = this.propertyErrors.get(error.key);
      this.propertyErrors.delete(error.key);
      formGroup.classList.remove('has-error');
      messageContainer.removeChild(message);
    }
    if (this.entityErrors.has(error.key)) {
      let message = this.entityErrors.get(error.key);
      this.entityErrors.delete(error.key);
      this.alert.removeChild(message);
      if (this.entityErrors.size === 0) {
        this.element.removeChild(this.alert);
        this.alert = null;
      }
    }
  }

  unrenderAll() {
    for ([error] of this.entityErrors) {
      this.unrender(error);
    }
  }
}
