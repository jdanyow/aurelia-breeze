export class BreezePropertyObserver {
  constructor(obj, propertyName, subscribe){
    this.obj = obj;
    this.propertyName = propertyName;
    this.subscribe = subscribe;
  }

  getValue(){
    return this.obj[this.propertyName];
  }

  setValue(newValue){
    this.obj[this.propertyName] = newValue;
  }
}

export class BreezeObjectObserver {
  constructor(obj){
    this.obj = obj;
    this.observers = {};
    this.callbacks = {};
    this.callbackCount = 0;
  }

  subscribe(propertyName, callback){
    if (this.callbacks[propertyName]) {
      this.callbacks[propertyName].push(callback);
    } else {
      this.callbacks[propertyName] = [callback];
    }

    if (this.callbackCount === 0) {
      this.subscription = this.obj.entityAspect.propertyChanged.subscribe(this.handleChanges.bind(this));
    }

    this.callbackCount++;

    return this.unsubscribe.bind(this, propertyName, callback);
  }

  unsubscribe(propertyName, callback) {
    var callbacks = this.callbacks[propertyName],
        index = callbacks.indexOf(callback);
    if (index === -1) {
      return;
    }
    callbacks.splice(index, 1);
    this.callbackCount--;
    if (this.callbackCount === 0) {
      this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
    }
  }

  getObserver(propertyName){
    return this.observers[propertyName]
      || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName, this.subscribe.bind(this, propertyName)));
  }

  handleChanges(change){
    var callbacks, i, ii, newValue, key;

    if (change.propertyName === null) {
      callbacks = this.callbacks;
      for (key in callbacks) {
        if (callbacks.hasOwnProperty(key)) {
          this.handleChanges({ propertyName: key, oldValue: null });
        }
      }
    } else {
      callbacks = this.callbacks[change.propertyName];
    }

    if (!callbacks) {
      return;
    }

    newValue = this.obj[change.propertyName];

    for (i = 0, ii = callbacks.length; i < ii; i++) {
      callbacks[i](newValue, change.oldValue);
    }
  }
}
