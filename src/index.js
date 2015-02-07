import breeze from 'breeze-client';
import {ObjectObservationAdapter} from 'aurelia-binding';
import {BreezeObservationAdapter} from './observation-adapter';
import {AjaxAdapter} from './ajax-adapter';
import {Q} from './promise-adapter';

export function install(aurelia) {
  // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // provide aurelia with a way to observe breeze properties.
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

  // install the ajax adapter.
  breeze.config.registerAdapter("ajax", AjaxAdapter);
  breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);

  // make breeze use our ES6 Promise based version of Q.
  breeze.setQ(Q);
}