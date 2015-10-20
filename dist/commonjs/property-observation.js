'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaBinding = require('aurelia-binding');

var BreezePropertyObserver = (function () {
  function BreezePropertyObserver(obj, propertyName) {
    _classCallCheck(this, _BreezePropertyObserver);

    this.obj = obj;
    this.propertyName = propertyName;
  }

  BreezePropertyObserver.prototype.getValue = function getValue() {
    return this.obj[this.propertyName];
  };

  BreezePropertyObserver.prototype.setValue = function setValue(newValue) {
    this.obj[this.propertyName] = newValue;
  };

  BreezePropertyObserver.prototype.subscribe = function subscribe(context, callable) {
    if (this.addSubscriber(context, callable)) {
      this.oldValue = this.obj[this.propertyName];
      this.obj.__breezeObserver__.subscriberAdded();
    }
  };

  BreezePropertyObserver.prototype.unsubscribe = function unsubscribe(context, callable) {
    if (this.removeSubscriber(context, callable)) {
      this.obj.__breezeObserver__.subscriberRemoved();
    }
  };

  var _BreezePropertyObserver = BreezePropertyObserver;
  BreezePropertyObserver = _aureliaBinding.subscriberCollection()(BreezePropertyObserver) || BreezePropertyObserver;
  return BreezePropertyObserver;
})();

exports.BreezePropertyObserver = BreezePropertyObserver;

function handleChange(change) {
  var object = change.entity;
  var propertyName = change.propertyName;
  var objectObserver = object.__breezeObserver__;
  if (propertyName === null) {
    var observers = objectObserver.observers;
    for (propertyName in observers) {
      if (observers.hasOwnProperty(propertyName)) {
        change.propertyName = propertyName;
        handleChange(change);
      }
    }
    return;
  }

  var observer = objectObserver.observers[propertyName];
  var newValue = object[propertyName];
  if (!observer || newValue === observer.oldValue) {
    return;
  }
  observer.callSubscribers(newValue, observer.oldValue);
  observer.oldValue = newValue;
}

var BreezeObjectObserver = (function () {
  function BreezeObjectObserver(obj) {
    _classCallCheck(this, BreezeObjectObserver);

    this.obj = obj;
    this.observers = {};
    this.subscribers = 0;
  }

  BreezeObjectObserver.prototype.subscriberAdded = function subscriberAdded() {
    if (this.subscribers === 0) {
      this.subscription = this.obj.entityAspect.propertyChanged.subscribe(handleChange);
    }

    this.subscribers++;
  };

  BreezeObjectObserver.prototype.subscriberRemoved = function subscriberRemoved(propertyName, callback) {
    this.subscribers--;

    if (this.subscribers === 0) {
      this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
    }
  };

  BreezeObjectObserver.prototype.getObserver = function getObserver(propertyName) {
    return this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName));
  };

  return BreezeObjectObserver;
})();

exports.BreezeObjectObserver = BreezeObjectObserver;