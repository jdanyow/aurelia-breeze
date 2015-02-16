define(["exports", "breeze"], function (exports, _breeze) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  exports.setHttpClientFactory = setHttpClientFactory;
  var breeze = _interopRequire(_breeze);

  var createHttpClient;

  function setHttpClientFactory(createClient) {
    createHttpClient = createClient;
  }

  var AjaxAdapter = exports.AjaxAdapter = (function () {
    function AjaxAdapter() {
      this.name = "aurelia";
      this.defaultHeaders;
      this.requestInterceptor = null;
    }

    _prototypeProperties(AjaxAdapter, null, {
      httpClient: {
        get: function () {
          return this.client || (this.client = createHttpClient());
        },
        configurable: true
      },
      initialize: {
        value: function initialize() {},
        writable: true,
        configurable: true
      },
      ajax: {
        value: function ajax(config) {
          var requestInfo, header, method;

          requestInfo = {
            adapter: this,
            config: clone(config),
            zConfig: config,
            success: config.success,
            error: config.error
          };
          requestInfo.config.request = this.httpClient.request;
          requestInfo.config.headers = clone(this.defaultHeaders || {});

          if (breeze.core.isFunction(this.requestInterceptor)) {
            this.requestInterceptor(requestInfo);
            if (this.requestInterceptor.oneTime) {
              this.requestInterceptor = null;
            }
            if (!requestInfo.config) return;
          }
          config = requestInfo.config;

          config.request.withParams(config.params);
          if (config.contentType) config.request.withHeader("Content-Type", config.contentType);
          for (var header in config.headers) {
            if (config.headers.hasOwnProperty(header)) {
              config.request.withHeader(header, config.headers[header]);
            }
          }

          method = config.dataType && config.dataType.toLowerCase() === "jsonp" ? "jsonp" : config.type.toLowerCase();

          config.request[method](config.url, config.data).then(function (r) {
            return requestInfo.success(new HttpResponse(r, requestInfo.zConfig));
          }, function (r) {
            return requestInfo.error(new HttpResponse(r, requestInfo.zConfig));
          });
        },
        writable: true,
        configurable: true
      }
    });

    return AjaxAdapter;
  })();
  var HttpResponse = exports.HttpResponse = (function () {
    function HttpResponse(aureliaResponse, config) {
      this.config = config;
      this.status = aureliaResponse.statusCode;
      this.data = aureliaResponse.content;
      this.headers = aureliaResponse.headers;
    }

    _prototypeProperties(HttpResponse, null, {
      getHeader: {
        value: function getHeader(headerName) {
          if (headerName === null || headerName === undefined || headerName === "") return this.headers.headers;
          return this.headers.get(headerName);
        },
        writable: true,
        configurable: true
      }
    });

    return HttpResponse;
  })();


  function clone(obj) {
    if (obj == null || typeof obj != "object") return obj;

    var temp = obj.constructor();

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = clone(obj[key]);
      }
    }
    return temp;
  }
  exports.__esModule = true;
});