export class BreezePropertyObserver {
  constructor(owner, obj, propertyName){
    this.owner = owner;
    this.obj = obj;
    this.propertyName = propertyName;
    this.callbacks = [];
    this.isSVG = false;
  }

  getValue(){
    return this.obj[this.propertyName];
  }

  setValue(newValue){
    this.obj[this.propertyName] = newValue;
  }

  trigger(newValue, oldValue){
    var callbacks = this.callbacks,
        i = callbacks.length;

    while(i--) {
      callbacks[i](newValue, oldValue);
    }
  }

  subscribe(callback){
    return this.owner.subscribe(this, callback);
  }
}

export class BreezeObjectObserver {
  constructor(obj){
    this.obj = obj;
    this.observers = {};  
  }

  subscribe(propertyObserver, callback){
    var callbacks = propertyObserver.callbacks;
    callbacks.push(callback);

    if(!this.observing){
      this.observing = true;
      this.subscription = this.obj.entityAspect.propertyChanged.subscribe(
        (entity, property, propertyName, oldValue, newValue, parent) => {
          this.handleChanges([{name: propertyName, object: entity, type: 'update', oldValue: oldValue}]);
        });
    }

    return function(){      
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length > 0)
        return;
      this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
      this.observing = false;
    };
  }

  getObserver(propertyName){
    var propertyObserver = this.observers[propertyName]
      || (this.observers[propertyName] = new BreezePropertyObserver(this, this.obj, propertyName));

    return propertyObserver;
  }

  handleChanges(changeRecords){
    var updates = {},
        observers = this.observers,
        i = changeRecords.length;
    
    while(i--) {
      var change = changeRecords[i],
          name = change.name;
  
      if(!(name in updates)){
        var observer = observers[name];
        updates[name] = true;
        if(observer){
          observer.trigger(change.object[name], change.oldValue);
        }
      }
    }
  }
}