import {ObjectObservationAdapter} from 'aurelia-binding';

export {
  install,
  BreezeObservationAdapter
} from './observation-adapter';

export {
  BreezeObjectObserver,
  BreezePropertyObserver
} from './property-observation';

export function install(aurelia) {
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());
}