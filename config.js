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
    "aurelia-binding": "github:aurelia/binding@0.6.0",
    "aurelia-http-client": "github:aurelia/http-client@0.8.0",
    "breeze": "npm:breeze-client@1.5.4",
    "github:aurelia/binding@0.6.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "core-js": "npm:core-js@0.9.5"
    },
    "github:aurelia/dependency-injection@0.7.0": {
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "core-js": "npm:core-js@0.9.5"
    },
    "github:aurelia/http-client@0.8.0": {
      "aurelia-path": "github:aurelia/path@0.6.0",
      "core-js": "npm:core-js@0.9.5"
    },
    "github:aurelia/metadata@0.5.0": {
      "core-js": "npm:core-js@0.9.5"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:core-js@0.9.5": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

