System.register(["aurelia-http-client", "breeze-client"], function (_export) {
  "use strict";

  var HttpClient, Headers, breeze, _prototypeProperties, AjaxAdapter, HttpResponse;


  function getQueryString(params) {
    var q = "";
    if (params) q = param(params);
    if (q.length) q = "?" + q;
    return q;
  }

  function param(map) {
    var r20 = /%20/g;
    return Object.keys(map).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(map[key]);
    }).join("&").replace(r20, "+");
  }
  return {
    setters: [function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
      Headers = _aureliaHttpClient.Headers;
    }, function (_breezeClient) {
      breeze = _breezeClient["default"];
    }],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      AjaxAdapter = _export("AjaxAdapter", (function () {
        function AjaxAdapter() {
          this.name = "aurelia";
          this.defaultHeaders;
          this.requestInterceptor = null;
        }

        _prototypeProperties(AjaxAdapter, null, {
          initialize: {
            value: function initialize() {},
            writable: true,
            configurable: true
          },
          ajax: {
            value: function ajax(config) {
              var method, headers, client, queryString, requestInfo;

              headers = new Headers(this.defaultHeaders || {});
              if (config.contentType) headers.add("Content-Type", config.contentType);

              requestInfo = {
                adapter: this,
                config: {
                  type: config.type,
                  url: config.url,
                  headers: headers,
                  params: config.params,
                  contentType: config.contentType,
                  data: config.data,
                  dataType: config.dataType,
                  crossDomain: config.crossDomain },
                zConfig: config,
                success: config.success,
                error: config.error
              };

              if (breeze.core.isFunction(this.requestInterceptor)) {
                this.requestInterceptor(requestInfo);
                if (this.requestInterceptor.oneTime) {
                  this.requestInterceptor = null;
                }
                if (!requestInfo.config) return;
                config = requestInfo.config;
              }

              method = config.dataType && config.dataType.toLowerCase() === "jsonp" ? "jsonp" : config.type.toLowerCase();

              queryString = getQueryString(config.params);

              client = new HttpClient(undefined, headers);
              client[method](config.url + queryString, config.data).then(function (r) {
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
      })());
    }
  };
});