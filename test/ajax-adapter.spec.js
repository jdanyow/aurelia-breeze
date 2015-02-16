import {HttpClient} from 'aurelia-http-client';
import {AjaxAdapter, setHttpClientFactory} from '../src/ajax-adapter';
import breeze from 'breeze';
import initMetadata from './metadata';

describe('ajax adapter', function() {
  var adapter;

  beforeAll(() => {
    setHttpClientFactory(() => new HttpClient());
    initMetadata(this);
  });

  beforeEach(() => {
    adapter = new AjaxAdapter();
    adapter.defaultHeaders = {
      Authorization: 'bearer token'
    };
    adapter.initialize();
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  it('can initialize', () => {
    expect(typeof adapter.initialize).toBe('function');
    adapter.initialize();
  });

  it('can GET', (done) => {
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
        error: httpResponse => {}
      },
      request;

    spyOn(config, 'success').and.callThrough();
    spyOn(config, 'error').and.callThrough();

    adapter.ajax(config);

    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe(url + '?a=b&c=d&e=1');
    expect(request.method).toBe(httpMethod);
    expect(request.requestHeaders['Authorization']).toBe('bearer token');

    request.respondWith({
      status: 200,
      contentType: contentType,
      responseText: responseData,
      responseHeaders: {
        'rate-limit': '999'
      }
    });

    setTimeout(() => {
      expect(config.success).toHaveBeenCalled();
      expect(config.error.calls.any()).toBe(false);
      done();
    }, 0);
  });

  it('can POST', (done) => {
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
        error: httpResponse => {}
      },
      request;

    spyOn(config, 'success').and.callThrough();
    spyOn(config, 'error').and.callThrough();

    adapter.ajax(config);

    request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe(url);
    expect(request.method).toBe(httpMethod);
    expect(JSON.stringify(request.data())).toEqual(requestData);
    expect(request.requestHeaders['Authorization']).toBe('bearer token');
    expect(request.requestHeaders['Content-Type']).toBe(contentType);

    request.respondWith({
      status: 200,
      contentType: contentType,
      responseText: responseData,
      responseHeaders: {
        'rate-limit': '999'
      }
    });

    setTimeout(() => {
      expect(config.success).toHaveBeenCalled();
      expect(config.error.calls.any()).toBe(false);
      done();
    }, 0);
  });

  it('can intercept', () => {
    var config = {
        type: 'GET',
        url: 'https://foo.com/bars',
        dataType: 'json',
        success: httpResponse => {},
        error: httpResponse => {}
      },
      request;

    adapter.requestInterceptor =
      requestInfo => {
        requestInfo.config.headers['intercepted'] = 'true';
      };

    spyOn(adapter, 'requestInterceptor').and.callThrough();

    adapter.ajax(config);

    request = jasmine.Ajax.requests.mostRecent();

    expect(adapter.requestInterceptor).toHaveBeenCalled();
    expect(request.requestHeaders['intercepted']).toBe('true');

    request.respondWith({
      status: 200
    });
  });

  it('handles null responseText', (done) => {
    var config = {
        type: 'GET',
        url: 'https://foo.com/bars',
        dataType: 'json',
        success: httpResponse => {
          expect(httpResponse.data).toBe(null);
        },
        error: httpResponse => {}
      },
      request;

    spyOn(config, 'success').and.callThrough();
    spyOn(config, 'error').and.callThrough();

    adapter.ajax(config);

    request = jasmine.Ajax.requests.mostRecent();

    request.respondWith({
      status: 200,
      responseText: 'null'
    });

    setTimeout(() => {
      expect(config.success).toHaveBeenCalled();
      expect(config.error.calls.any()).toBe(false);
      done();
    }, 0);
  });
});
