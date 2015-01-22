import {ObjectObservationAdapter} from 'aurelia-binding';

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

export class BreezeObservationAdapter {
  handlesProperty(object, propertyName) {
    // probably a hot path...
    // todo: compare perf of entityType.getProperty vs searching entityType.dataProperties/complexProperties.
    // todo: consider keeping dictionary-object keyed on entityType.name + propertyName to avoid reflecting 
    //       on the breeze type each time.  would need a way to scope the dictionary to a particular 
    //       metadatastore instance or resource name...
    // todo: test whether change events are raised for detached entities.

    var entityType = object.entityType, property;
    return entityType && object.entityAspect && (property = entityType.getProperty(propertyName)) && property.isScalar;
  }

  createObserver(object, propertyName) {
    if (!handlesProperty(object, propertyName))
      throw new Error(`BreezeBindingAdapter does not support observing the ${propertyName} property.  Check the handlesProperty method before calling createObserver.`);
    // todo: return the new observer... need to add properties similar to Aurelia's __observers__ and _observer_ properties
  }
}

export function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationdapter());
}