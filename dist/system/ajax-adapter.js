System.register(["breeze"], function (_export) {
  "use strict";

  var breeze, _prototypeProperties, _classCallCheck, createHttpClient, AjaxAdapter, HttpResponse;
  _export("setHttpClientFactory", setHttpClientFactory);

  function setHttpClientFactory(createClient) {
    createHttpClient = createClient;
  }

  function clone(obj) {
    if (obj == null || typeof obj != "object") {
      return obj;
    }var temp = obj.constructor();

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = clone(obj[key]);
      }
    }
    return temp;
  }
  return {
    setters: [function (_breeze) {
      breeze = _breeze["default"];
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      AjaxAdapter = _export("AjaxAdapter", (function () {
        function AjaxAdapter() {
          _classCallCheck(this, AjaxAdapter);

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
                if (!requestInfo.config) {
                  return;
                }
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
      })());
      HttpResponse = _export("HttpResponse", (function () {
        function HttpResponse(aureliaResponse, config) {
          _classCallCheck(this, HttpResponse);

          this.config = config;
          this.status = aureliaResponse.statusCode;
          this.data = aureliaResponse.content;
          this.headers = aureliaResponse.headers;
        }

        _prototypeProperties(HttpResponse, null, {
          getHeader: {
            value: function getHeader(headerName) {
              if (headerName === null || headerName === undefined || headerName === "") {
                return this.headers.headers;
              }return this.headers.get(headerName);
            },
            writable: true,
            configurable: true
          }
        });

        return HttpResponse;
      })());
    }
  };
});