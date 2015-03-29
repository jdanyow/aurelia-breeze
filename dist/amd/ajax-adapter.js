define(["exports", "breeze"], function (exports, _breeze) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var breeze = _interopRequire(_breeze);

  var extend = breeze.core.extend;

  var HttpResponse = (function () {
    function HttpResponse(aureliaResponse, config) {
      _classCallCheck(this, HttpResponse);

      this.config = config;
      this.status = aureliaResponse.statusCode;
      this.data = aureliaResponse.content;
      this.headers = aureliaResponse.headers;
    }

    _createClass(HttpResponse, {
      getHeader: {
        value: function getHeader(headerName) {
          if (headerName === null || headerName === undefined || headerName === "") {
            return this.headers.headers;
          }return this.headers.get(headerName);
        }
      }
    });

    return HttpResponse;
  })();

  var AjaxAdapter = (function () {
    function AjaxAdapter() {
      _classCallCheck(this, AjaxAdapter);

      this.name = "aurelia";
      this.defaultHeaders;
      this.requestInterceptor = null;
    }

    _createClass(AjaxAdapter, {
      setHttpClientFactory: {
        value: function setHttpClientFactory(createHttpClient) {
          this.createHttpClient = createHttpClient;
        }
      },
      httpClient: {
        get: function () {
          return this.client || (this.client = this.createHttpClient());
        }
      },
      initialize: {
        value: function initialize() {}
      },
      ajax: {
        value: function ajax(config) {
          var requestInfo, header, method, request;

          // build the request info object.
          requestInfo = {
            adapter: this,
            config: extend({}, config),
            zConfig: config,
            success: config.success,
            error: config.error
          };
          requestInfo.config.request = this.httpClient.createRequest();
          requestInfo.config.headers = extend(extend({}, this.defaultHeaders), config.headers);

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
          request = config.request;

          // uri.
          request.withUri(config.url);

          // method.
          method = config.dataType && config.dataType.toLowerCase() === "jsonp" ? "jsonp" : config.type.toLowerCase();
          method = "as" + method.charAt(0).toUpperCase() + method.slice(1);
          request[method]();

          // params.
          request.withParams(config.params);

          // headers.
          if (config.contentType) {
            request.withHeader("Content-Type", config.contentType);
          }
          for (header in config.headers) {
            if (config.headers.hasOwnProperty(header)) {
              request.withHeader(header, config.headers[header]);
            }
          }

          // content.
          if (config.hasOwnProperty("data")) {
            request.withContent(config.data);
          }

          // send the request.
          request.send().then(function (r) {
            return requestInfo.success(new HttpResponse(r, requestInfo.zConfig));
          }, function (r) {
            return requestInfo.error(new HttpResponse(r, requestInfo.zConfig));
          });
        }
      }
    });

    return AjaxAdapter;
  })();

  breeze.config.registerAdapter("ajax", AjaxAdapter);
});