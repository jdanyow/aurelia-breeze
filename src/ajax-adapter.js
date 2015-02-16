import breeze from 'breeze';

var createHttpClient;

export function setHttpClientFactory(createClient) {
  createHttpClient = createClient;
}

export class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.defaultHeaders;
    this.requestInterceptor = null;
  }

  get httpClient() {
    return this.client || (this.client = createHttpClient());
  }

  initialize() {}

  ajax(config) {
    var requestInfo, header, method;

    // build the request info object.
    requestInfo = {
      adapter: this,
      config: clone(config),
      zConfig: config,
      success: config.success,
      error: config.error
    };
    requestInfo.config.request = this.httpClient.request;
    requestInfo.config.headers = clone(this.defaultHeaders || {});

    // submit the request-info for interception.
    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
      if (!requestInfo.config)
        return;
    }
    config = requestInfo.config;

    // configure the request.
    config.request.withParams(config.params);
    if (config.contentType)
      config.request.withHeader('Content-Type', config.contentType);
    for(var header in config.headers) {
      if(config.headers.hasOwnProperty(header)) {
        config.request.withHeader(header, config.headers[header]);
      }
    }

    // determine which request method to use.
    method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();

    // send the request.
    config.request[method](config.url, config.data)
      .then(
        r => requestInfo.success(new HttpResponse(r, requestInfo.zConfig)),
        r => requestInfo.error(new HttpResponse(r, requestInfo.zConfig))
      );
  }
}

export class HttpResponse {
  constructor(aureliaResponse, config) {
    this.config = config;
    this.status = aureliaResponse.statusCode;
    this.data = aureliaResponse.content;
    this.headers = aureliaResponse.headers;
  }

  getHeader(headerName) {
    if (headerName === null || headerName === undefined || headerName === '')
      return this.headers.headers;
    return this.headers.get(headerName);
  }
}

function clone(obj) {
  if(obj == null || typeof(obj) != 'object')
    return obj;

  var temp = obj.constructor();

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      temp[key] = clone(obj[key]);
    }
  }
  return temp;
}
