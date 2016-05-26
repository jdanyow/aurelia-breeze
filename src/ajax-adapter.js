import breeze from 'breeze-client';

const extend = breeze.core.extend;

export class HttpResponse {
  constructor(aureliaResponse, config) {
    this.config = config;
    this.status = aureliaResponse.status;
    this.data = aureliaResponse.content;
    this.headers = aureliaResponse.headers;
  }

  getHeader(headerName) {
    if (headerName === null || headerName === undefined || headerName === '') {
      return this.headers.headers;
    }
    return this.headers.get(headerName);
  }
}

function encodeParams(obj) {
  var query = '';
  var subValue, innerObj, fullSubName;

  for (var name in obj) {
    var value = obj[name];

    if (value instanceof Array) {
      for (var i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += encodeParams(innerObj) + '&';
      }
    } else if (value && value.toISOString) { // a feature of Date-like things
       query += encodeURIComponent(name) + '=' + encodeURIComponent(value.toISOString()) + '&';
    } else if (value instanceof Object) {
      for (var subName in value) {
       subValue = value[subName];
       fullSubName = name + '[' + subName + ']';
       innerObj = {};
       innerObj[fullSubName] = subValue;
       query += encodeParams(innerObj) + '&';
     }
    } else if (value === null) {
      query += encodeURIComponent(name) + '=&';
    } else if (value !== undefined) {
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
};

export class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.requestInterceptor = null;
  }

  setHttpClientFactory(createHttpClient) {
    this.createHttpClient = createHttpClient;
  }

  get httpClient() {
    return this.client || (this.client = this.createHttpClient());
  }

  initialize() { }

  ajax(config) {
    // build the request info object.
    let requestInfo = {
      adapter: this,
      config: extend({}, config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient;
    requestInfo.config.headers = extend({}, config.headers);

    // submit the request-info for interception.
    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
      if (!requestInfo.config) {
        return;
      }
    }

    config = requestInfo.config;
    let init = {
      method: config.type
    }
    // headers: fetch
    init.headers = new Headers();
    for (let header in config.headers) {
      if (config.headers.hasOwnProperty(header)) {
        init.headers.append(header, config.headers[header]);
      }
    }

    if (config.hasOwnProperty('data')) {
      init.body = config.data;
    }

    if (config.params) {
      // fetch does not handle params by design.
      // See comments in fetch polyfill https://github.com/github/fetch/issues/167
      // But params are used by breeze.Query.withParameters. So manually add to params to url.
      // Fix from Breeze.AjaxAngularAdapter which refered to:
      // http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
      var delim = (config.url.indexOf('?') >= 0) ? '&' : '?';
      config.url = config.url + delim + encodeParams(config.params);
    }

    if (config.contentType) {
      init.headers.append('Content-Type', config.contentType);
    }

    // send the request.
    //let request = new Request(config.url, init);
    //requestInfo.config.request.fetch(request)
    // preassembling fetch like this breaks passing withDefaults({credentials: ...
    // Credentials is used for handling CORS.

    requestInfo.config.request.fetch(config.url, init)
      .then(response => {
        var responseInput = new HttpResponse(response, requestInfo.zConfig);
        response.json()
          .then(x => {
            responseInput.data = x;
            requestInfo.success(responseInput);
          })
          .catch((err) => {
            responseInput.data = err;
            requestInfo.error(responseInput)
          });
      },
      response => {
        var responseInput = new HttpResponse(response, requestInfo.zConfig);
        response.json()
          .then(x => {
            responseInput.data = x;
            requestInfo.error(responseInput);
          })
          .catch(err => {
            responseInput.data = err;
            requestInfo.error(responseInput)
          });
      });

  }
}

breeze.config.registerAdapter('ajax', AjaxAdapter);
