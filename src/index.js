import breeze from 'breeze';
import {ObjectObservationAdapter} from 'aurelia-binding';
import {HttpClient} from 'aurelia-http-client';
import {BreezeObservationAdapter} from './observation-adapter';
import {AjaxAdapter, setHttpClientFactory} from './ajax-adapter';
import {Q} from './promise-adapter';

export function install(aurelia) {
  // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // provide aurelia with a way to observe breeze properties.
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

  // install the ajax adapter.
  breeze.config.registerAdapter("ajax", AjaxAdapter);
  breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  setHttpClientFactory(() => aurelia.container.get(HttpClient));

  // make breeze use our ES6 Promise based version of Q.
  breeze.config.setQ(Q);
}
