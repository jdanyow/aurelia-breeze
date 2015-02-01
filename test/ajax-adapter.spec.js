import {AjaxAdapter} from '../src/ajax-adapter';

decribe('ajax adapter', () => {
  var adapter;

  beforeAll() {
    adapter = new AjaxAdapter();    
    adapter.initialize();
  }

  it('can call initialize', () => {
    expect(typeof adapter.initialize).toBe('function');
  });

  it('can GET', () => {

  });

  it('can POST', () => {

  });

  it('can intercept', () => {

  });

});