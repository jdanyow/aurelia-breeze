export class BreezeScalarPropertyObserver {
  constructor(object, propertyName) {
    this.object = object;
    this.propertyName = propertyName;
  }

  getValue() {
    return this.object[this.propertyName];
  }

  setValue(value) {
    this.object[this.propertyName] = value;
  }

  subscribe(callback) {
    // lazy create the callbacks array.
    if (!this.callbacks)
      this.callbacks = [];
    let callbacks = this.callbacks;

    // push the callback.
    // todo: ask Rob if we need to check whether a callback has already been added.
    callbacks.push(callback);

    // todo: ask Ward about using entityManager.entityChanged to reduce number of subscriptions (if that even matters).  need to consider detached entities.
    if (!this.hasOwnProperty('propertyChangedSubscription')) {
      this.propertyChangedSubscription = this.object.entityAspect.propertyChanged.subscribe(
        function(entity, property, propertyName, oldValue, newValue, parent) {
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](); // todo: what are the callback args?
          }
        });
    }

    return () => {
      // dispose.
      callbacks.splice(callbacks.indexof(callback), 1);
      if (callbacks.length > 0)
        return;
      this.object.entityAspect.propertyChanged.unsubscribe(this.propertyChangedSubscription);
    }
  }
}

export class BreezeNonScalarPropertyObserver {
  // todo: ask Rob what the callbacks should be invoked with when items are added/removed etc etc.
  // non-scalar nav props shouldn't be assignable right?
}

export class BreezeBindingAdapter {
  handlesProperty(object, propertyName) {
    // to discuss with Ward:  probably a hot path...
    // todo: compare perf of entityType.getProperty vs searching entityType.dataProperties/complexProperties.
    // todo: consider keeping dictionary-object keyed on entityType.name + propertyName to avoid reflecting 
    //       on the breeze type each time.  would need a way to scope the dictionary to a particular 
    //       metadatastore instance or resource name...
    // todo: consider support for binding to props on the entityAspect that have events such as "validationErrors".
    // todo: test whether change events are raised for detached entities.

    let entityType = object.entityType;
    return entityType && object.entityAspect && entityType.getProperty(propertyName);
  }

  createObserver(object, propertyName) {
    if (object.entityType.getProperty(propertyName).isScalar)
      return new BreezeScalarPropertyObserver(object, propertyName);

    // todo:
    throw new Error('Not Implemented:  non-scalar data properties and navigation properties');
  }
}



// todo: add tests for all combinations of:

// complex types
// enttiy types
// scalar data properties
// non-scalar data properties
// scalar navigation properties
// non-scalar navigation properties