import breeze from 'breeze-client';

const extend = breeze.core.extend;

export class HttpResponse {
  constructor(aureliaResponse, config) {
    this.config = config;
    this.status = aureliaResponse.statusCode;
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

  initialize() {}

  ajax(config) {
    // build the request info object.
    let requestInfo = {
      adapter: this,
      config: extend({}, config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient.createRequest();
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

    // configure the request...
    let request = config.request;

    // uri.
    request.withUrl(config.url);

    // method.
    let method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();
    method = 'as' + method.charAt(0).toUpperCase() + method.slice(1);
    request[method]();

    // params.
    request.withParams(config.params);

    // headers.
    if (config.contentType) {
      request.withHeader('Content-Type', config.contentType);
    }
    for (let header in config.headers) {
      if (config.headers.hasOwnProperty(header)) {
        request.withHeader(header, config.headers[header]);
      }
    }

    // content.
    if (config.hasOwnProperty('data')) {
      request.withContent(config.data);
    }

    // send the request.
    request.send()
      .then(
        r => requestInfo.success(new HttpResponse(r, requestInfo.zConfig)),
        r => requestInfo.error(new HttpResponse(r, requestInfo.zConfig))
      );
  }
}

breeze.config.registerAdapter('ajax', AjaxAdapter);
