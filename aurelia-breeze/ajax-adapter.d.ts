declare module 'aurelia-breeze' {
  import breeze from 'breeze';
  export class HttpResponse {
    constructor(aureliaResponse: any, config: any);
    getHeader(headerName: any): any;
  }
  export class AjaxAdapter {
    constructor();
    setHttpClientFactory(createHttpClient: any): any;
    httpClient: any;
    initialize(): any;
    ajax(config: any): any;
  }
}