System.config({
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "aurelia-breeze/*": "dist/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "aurelia-binding": "github:aurelia/binding@0.4.0",
    "aurelia-http-client": "github:aurelia/http-client@0.6.1",
    "breeze": "npm:breeze-client@1.5.4",
    "github:aurelia/binding@0.4.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.5.1",
      "aurelia-metadata": "github:aurelia/metadata@0.3.4",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.5"
    },
    "github:aurelia/dependency-injection@0.5.1": {
      "aurelia-logging": "github:aurelia/logging@0.2.7",
      "aurelia-metadata": "github:aurelia/metadata@0.3.4",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:aurelia/http-client@0.6.1": {
      "aurelia-path": "github:aurelia/path@0.4.6",
      "core-js": "npm:core-js@0.4.10"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:core-js@0.4.10": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

