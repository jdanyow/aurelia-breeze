import breeze from 'breeze';
import {Q} from './promise-adapter';
import {ObjectObservationAdapter} from 'aurelia-binding';
import {BreezeObservationAdapter} from './observation-adapter';
import {HttpClient} from 'aurelia-http-client';
import {} from './ajax-adapter';

export function install(aurelia) {
  // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // make breeze use our ES6 Promise based version of Q.
  breeze.config.setQ(Q);

  // provide aurelia with a way to observe breeze properties.
  aurelia.withInstance(ObjectObservationAdapter, new BreezeObservationAdapter());

  // provide the ajax adapter with an HttpClient factory...
  // the adapter lazily gets the HttpClient instance to enable scenarios where
  // the aurelia-breeze plugin is installed prior to the HttpClient being
  // configured in the container.
  var adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(() => aurelia.container.get(HttpClient));
}
