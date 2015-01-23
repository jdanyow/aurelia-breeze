import {ObjectObservationAdapter} from 'aurelia-binding';
import {
  BreezeObjectObserver, 
  BreezePropertyObserver, 
} from './property-observation';

function createObserverLookup(obj) {
  var value = new BreezeObjectObserver(obj);

  Object.defineProperty(obj, "__breezeObserver__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
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

  getObserver(object, propertyName) {
    var observerLookup;
    if (!handlesProperty(object, propertyName))
      throw new Error(`BreezeBindingAdapter does not support observing the ${propertyName} property.  Check the handlesProperty method before calling createObserver.`);
    observerLookup = obj.__breezeObserver__ || createObserverLookup(obj);
    return observerLookup.getObserver(propertyName);
  }
}

export function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
}