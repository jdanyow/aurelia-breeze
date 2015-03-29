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
    if (!this.callbacks[propertyName]) {
      this.callbacks[propertyName] = [callback];
    } else if (this.callbacks[propertyName].indexOf(callback) !== -1) {
      return; // throw?
    } else {
      this.callbacks[propertyName].push(callback);
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
      return; // throw?
    }
    callbacks.splice(callbacks.indexOf(callback), 1);
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
    var callbacks = this.callbacks[change.propertyName], i, ii, newValue;
    if (!callbacks) {
      return;
    }

    newValue = this.obj[change.propertyName];

    for (i = 0, ii = callbacks.length; i < ii; i++) {
      callbacks[i](newValue, change.oldValue);
    }
  }
}
