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

function createCanObserveLookup(entityType) {
  var value = {}, properties = entityType.getProperties(), property, ii = properties.length, i;

  for(i = 0; i < ii; i++) {
    property = properties[i];

    // determine whether the adapter should handle the property...
    // all combinations of navigation/data properties * scalar/non-scalar properties are handled EXCEPT
    // non-scalar navigation properties because Aurelia handles these well natively.
    value[property.name] = property.isDataProperty || property.isScalar;
  }

  Object.defineProperty(entityType, "__canObserve__", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  });

  return value;
}

export class BreezeObservationAdapter {
  handlesProperty(object, propertyName) {
    var type = object.entityType
    return type ? !!(type.__canObserve__ || createCanObserveLookup(type))[propertyName] : false;
  }

  getObserver(object, propertyName) {
    var observerLookup;

    if (!this.handlesProperty(object, propertyName))
      throw new Error(`BreezeBindingAdapter does not support observing the ${propertyName} property.  Check the handlesProperty method before calling createObserver.`);

    observerLookup = object.__breezeObserver__ || createObserverLookup(object);
    return observerLookup.getObserver(propertyName);
  }
}
