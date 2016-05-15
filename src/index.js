import {ObserverLocator} from 'aurelia-binding';
import {HttpClient} from 'aurelia-http-client';
import breeze from 'breeze-client';
import {Q} from './promise-adapter';
import {BreezeObservationAdapter} from './observation-adapter';
import {AjaxAdapter} from './ajax-adapter'; //eslint-disable-line no-unused-vars

export function configure(frameworkConfig) {
  // ensure breeze is using the modelLibrary backing store (vs Knockout or Backbone)
  breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore');

  // make breeze use our ES6 Promise based version of Q.
  breeze.config.setQ(Q);

  // provide aurelia with a way to observe breeze properties.
  frameworkConfig.container.get(ObserverLocator).addAdapter(new BreezeObservationAdapter());

  // provide the ajax adapter with an HttpClient factory...
  // the adapter lazily gets the HttpClient instance to enable scenarios where
  // the aurelia-breeze plugin is installed prior to the HttpClient being
  // configured in the container.
  let adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
  adapter.setHttpClientFactory(() => frameworkConfig.container.get(HttpClient));
}
