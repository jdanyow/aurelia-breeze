import {HttpClient, Headers} from 'aurelia-http-client';
import breeze from 'breeze-client';

export class AjaxAdapter {
  constructor() {
    this.name = 'aurelia';
    this.defaultHeaders;
    this.requestInterceptor = null;
  }

  initialize() {
  }

  ajax(config) {
    var method = config.type.toLowerCase(),
        headers = new Headers(this.defaultHeaders || {}),
        client = new HttpClient(config.url, headers),
        aConfig = {
          client: client,
          params: config.params,
          data: config.data
        };

    if (config.contentType)
      headers.add('Content-Type', client.contentType);    

    var requestInfo = {
      adapter: this,           // this adapter
      config: aConfig,         // the Aurelia config
      zConfig: config,         // the config arg from the calling Breeze data service adapter
      success: config.success, // adapter's success callback
      error: config.error      // adapter's error callback
    }

    if (breeze.core.isFunction(this.requestInterceptor)) {
      this.requestInterceptor(requestInfo);
      if (this.requestInterceptor.oneTime) {
        this.requestInterceptor = null;
      }
    }

    if (!requestInfo.config)
      return;

    client[method](requestInfo.config.params || '', requestInfo.config.data)
      .then(
        response => {
          if (!requestInfo.success)
            return;
          requestInfo.success(new HttpResponse(response, config));
        },
        error => {
          // should never get here.  The aurelia http client resolves all 200s, 300s, 400s, 500s, dropped requests and timeouts.
          // https://github.com/aurelia/http-client/issues/10
          if (!requestInfo.error)
            return;
          // todo: breeze is expecting an instance of HttpResponse.
          requestInfo.error(error);
        });
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



// ajaxImpl.ajax({
//       type: "POST",
//       url: url,
//       dataType: 'json',
//       contentType: "application/json",
//       data: bundle,
//       success: function (httpResponse) {
//         var data = httpResponse.data;
//         httpResponse.saveContext = saveContext;
//         var entityErrors = data.Errors || data.errors;
//         if (entityErrors) {
//           handleHttpError(deferred, httpResponse);
//         } else {
//           var saveResult = adapter._prepareSaveResult(saveContext, data);
//           saveResult.httpResponse = httpResponse;
//           deferred.resolve(saveResult);
//         }

//       },
//       error: function (httpResponse) {
//         httpResponse.saveContext = saveContext;
//         handleHttpError(deferred, httpResponse);
//       }
//     });

// proto.fetchMetadata = function (metadataStore, dataService) {
//     var serviceName = dataService.serviceName;
//     var url = dataService.qualifyUrl("Metadata");

//     var deferred = Q.defer();

//     ajaxImpl.ajax({
//       type: "GET",
//       url: url,
//       dataType: 'json',
//       success: function (httpResponse) {

//         // might have been fetched by another query
//         if (metadataStore.hasMetadataFor(serviceName)) {
//           return deferred.resolve("already fetched");
//         }
//         var data = httpResponse.data;
//         try {
//           var metadata = typeof (data) === "string" ? JSON.parse(data) : data;
//           metadataStore.importMetadata(metadata);
//         } catch (e) {
//           var errMsg = "Unable to either parse or import metadata: " + e.message;
//           return handleHttpError(deferred, httpResponse, "Metadata query failed for: " + url + ". " + errMsg);
//         }

//         // import may have brought in the service.
//         if (!metadataStore.hasMetadataFor(serviceName)) {
//           metadataStore.addDataService(dataService);
//         }

//         return deferred.resolve(metadata);

//       },
//       error: function (httpResponse) {
//         handleHttpError(deferred, httpResponse, "Metadata query failed for: " + url);
//       }
//     });
//     return deferred.promise;
//   };


// proto.executeQuery = function (mappingContext) {

//     var deferred = Q.defer();
//     var url = mappingContext.getUrl();

//     var params = {
//       type: "GET",
//       url: url,
//       params: mappingContext.query.parameters,
//       dataType: 'json',
//       success: function (httpResponse) {
//         var data = httpResponse.data;
//         try {
//           var rData;
//           var results = data && (data.results || data.Results);
//           if (results) {
//             rData = { results: results, inlineCount: data.inlineCount || data.InlineCount, httpResponse: httpResponse };
//           } else {
//             rData = { results: data, httpResponse: httpResponse };
//           }

//           deferred.resolve(rData);
//         } catch (e) {
//           if (e instanceof Error) {
//             deferred.reject(e);
//           } else {
//             handleHttpError(httpResponse);
//           }
//         }

//       },
//       error: function (httpResponse) {
//         handleHttpError(deferred, httpResponse);
//       }
//     };
//     if (mappingContext.dataService.useJsonp) {
//       params.dataType = 'jsonp';
//       params.crossDomain = true;
//     }
//     ajaxImpl.ajax(params);
//     return deferred.promise;
//   };

// type: 'get' / 'post'
// contentType: "application/json",  (post only)
// data: bundle,                     (post only)
// url:
// params:
// dataType: 'json' / 'jsonp'        (jsonp, only on gets, crossDomain is true)
// crossDomain: true                 (only on gets, crossDomain istrue)
// success:
// error:
