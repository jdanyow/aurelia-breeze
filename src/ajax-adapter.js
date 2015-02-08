import {HttpClient, Headers} from 'aurelia-http-client';
import breeze from 'breeze';

export class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.defaultHeaders;
    this.requestInterceptor = null;
  }

  initialize() {}

  ajax(config) {
    var method, headers, client, queryString, requestInfo;

    // create the Aurelia Headers instance.
    headers = new Headers(this.defaultHeaders || {});
    if (config.contentType)
      headers.add('Content-Type', config.contentType);

    // build the request info object.
    requestInfo = {
      adapter: this,
      config: {
        type: config.type,
        url: config.url,
        headers: headers,
        params: config.params,
        contentType: config.contentType, //   only supplied when type is 'post'
        data: config.data, //                 only supplied when type is 'post'
        dataType: config.dataType, //         'json' or 'jsonp'.  when 'jsonp', crossDomain is true.
        crossDomain: config.crossDomain //    true when dataType is 'jsonp'
      },
      zConfig: config,
      success: config.success,
      error: config.error
    };

    // submit the request info to interception.
    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
      if (!requestInfo.config)
        return;
      // use the intercepted config.
      config = requestInfo.config;
    }

    // determine which method on the Aurelia HttpClient to use.
    method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();

    // create the query string.
    // todo: refactor once https://github.com/aurelia/http-client/issues/4 is implemented.
    queryString = getQueryString(config.params);

    // send the request.
    client = new HttpClient(undefined, headers);
    client[method](config.url + queryString, config.data)
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

function getQueryString(params) {
  var q = '';
  if (params)
    q = param(params);
  if (q.length)
    q = '?' + q;
  return q;
}

function param(map) {
  var r20 = /%20/g;
  return Object.keys(map)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(map[key]))
    .join('&')
    .replace(r20, "+");
}