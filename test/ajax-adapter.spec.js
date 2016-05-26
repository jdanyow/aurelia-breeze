import breeze from 'breeze';
import getEntityManager from './breeze-setup';
import {HttpClient} from 'aurelia-fetch-client';
import {initialize} from 'aurelia-pal-browser';
initialize();

//Why was this here?
// if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
//   var CustomEvent = function(event, params) {
//     var params = params || {
//       bubbles: false,
//       cancelable: false,
//       detail: undefined
//     };
//
//     var evt = document.createEvent("CustomEvent");
//     evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
//     return evt;
//   };
//
//   CustomEvent.prototype = window.Event.prototype;
//   window.CustomEvent = CustomEvent;
// }

describe('ajax adapter', function() {
  var adapter, entityManager;
  let originalFetch = window.fetch;

  beforeEach(() => {
    fetch = window.fetch = jasmine.createSpy('fetch');

    var httpClient = new HttpClient();
    entityManager = getEntityManager();
    adapter = breeze.config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(() => httpClient);
    adapter.initialize();
  });

  afterEach(() => {
    fetch = window.fetch = originalFetch;
  });


  it('can initialize', () => {
    expect(typeof adapter.initialize).toBe('function');
    adapter.initialize();
  });

  it('can GET', done => {
    var responseData = JSON.stringify({ donald: 'draper' }),
      url = 'https://foo.com/bars',
      contentType = 'application/json',
      httpMethod = 'GET',
      config = {
        type: httpMethod,
        url: url,
        dataType: 'json',
        params: {
          a: 'b',
          c: 'd',
          e: 1
        },
        success: httpResponse => {
          expect(httpResponse.config).toBe(config);
          expect(httpResponse.status).toBe(200);
          expect(JSON.stringify(httpResponse.data)).toBe(responseData);
          expect(httpResponse.getHeader).toBeDefined();
          expect(httpResponse.getHeader('rate-limit')).toBe('999');
        },
        error: httpResponse => {
          expect(httpResponse).toBe(null);
        }
      };

    let response = createOkResponse(responseData, url);
    response.headers.append('rate-limit', '999');
    fetch.and.returnValue(Promise.resolve(response));

    spyOn(config, 'success').and.callThrough();
    spyOn(config, 'error').and.callThrough();

    adapter.ajax(config);

    setTimeout(() => {
      let request = fetch.calls.first().args[0];

      expect(request.url).toBe(url + '?a=b&c=d&e=1');
      expect(request.method).toBe(httpMethod);

      setTimeout(() => {
        expect(config.success).toHaveBeenCalled();
        expect(config.error.calls.any()).toBe(false);
        done();
      }, 50);
    }, 50);
  });

  it('can POST', done => {
    var requestData = JSON.stringify({ don: 'draper' }),
      responseData = JSON.stringify({ roger: 'sterling' }),
      url = 'https://foo.com/SaveChanges',
      contentType = 'application/json',
      httpMethod = 'POST',
      config = {
        type: httpMethod,
        url: url,
        dataType: 'json',
        contentType: contentType,
        data: requestData,
        success: httpResponse => {
          expect(httpResponse.config).toBe(config);
          expect(httpResponse.status).toBe(200);
          expect(JSON.stringify(httpResponse.data)).toBe(responseData);
          expect(httpResponse.getHeader).toBeDefined();
          expect(httpResponse.getHeader('rate-limit')).toBe('999');
        },
        error: httpResponse => {
          expect(httpResponse).toBe(null);
        }
      };

    let response = createOkResponse(responseData, url);
    response.headers.append('rate-limit', '999');
    fetch.and.returnValue(Promise.resolve(response));


    spyOn(config, 'success').and.callThrough();
    spyOn(config, 'error').and.callThrough();

    adapter.ajax(config);

    setTimeout(() => {
      let request = fetch.calls.first().args[0];

      expect(request.url).toBe(url);
      expect(request.method).toBe(httpMethod);
      expect(request.headers.get('Content-Type')).toBe(contentType);
      request.json().then((jsonData) => {
        expect(JSON.stringify(jsonData)).toEqual(requestData);
      });

      setTimeout(() => {
        expect(config.success).toHaveBeenCalled();
        expect(config.error.calls.any()).toBe(false);
        done();
      }, 50);
    }, 50);
  });

  it('can intercept', done => {
    var config = {
        type: 'GET',
        url: 'https://foo.com/bars',
        dataType: 'json',
        success: httpResponse => {},
        error: httpResponse => {}
      };
    fetch.and.returnValue(Promise.resolve(createOkResponse('{}', config.url)));

    adapter.requestInterceptor =
      requestInfo => {
        requestInfo.config.headers['intercepted'] = 'true';
      };

    spyOn(adapter, 'requestInterceptor').and.callThrough();

    adapter.ajax(config);

    setTimeout(() => {
      let request = fetch.calls.first().args[0];

      expect(adapter.requestInterceptor).toHaveBeenCalled();
      expect(request.headers.get('intercepted')).toBe('true');

      done();
    }, 50);
  });

  //When would a null response ever be a valid?
  //Breeze returns a response with a type even when an empty dataset is returned.
  // it('handles null response', done => {
  //   var config = {
  //       type: 'GET',
  //       url: 'https://foo.com/bars',
  //       dataType: 'json',
  //       success: httpResponse => {
  //         expect(httpResponse.data).toBe(null);
  //       },
  //       error: httpResponse => {
  //         expect(httpResponse).toBe(null);
  //       }
  //     };
  //
  //     fetch.and.returnValue(Promise.resolve(createOkResponse(null, config.url)));
  //
  //   spyOn(config, 'success').and.callThrough();
  //   spyOn(config, 'error').and.callThrough();
  //
  //   adapter.ajax(config);
  //
  //   setTimeout(() => {
  //     let request = fetch.calls.first().args[0];
  //
  //     setTimeout(() => {
  //       expect(config.success).toHaveBeenCalled();
  //       expect(config.error.calls.any()).toBe(false);
  //       done();
  //     }, 50);
  //   }, 50);
  // });
});

function createOkResponse(responseData, url) {
  //everything below is from a normal fetch response
  return new Response(responseData,
    {
      bodyUsed: false,
      headers: new Headers({
        'pragma': 'no-cache',
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-cache',
        'expires': -1,
      }),
      ok: true,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: url
    });
}
