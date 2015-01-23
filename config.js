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
    "aurelia-binding": "github:aurelia/binding@0.3.1",
    "breeze.js": "github:Breeze/breeze.js@1.5.2",
    "github:Breeze/breeze.js@1.5.2": {
      "Q": "npm:q@2.0.2",
      "jquery": "github:components/jquery@2.1.3"
    },
    "github:aurelia/binding@0.3.1": {
      "aurelia-metadata": "github:aurelia/metadata@0.3.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.2.2"
    },
    "github:jspm/nodelibs-fs@0.1.0": {
      "assert": "npm:assert@1.3.0",
      "fs": "github:jspm/nodelibs-fs@0.1.0"
    },
    "github:jspm/nodelibs-process@0.1.0": {
      "process": "npm:process@0.10.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:asap@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:collections@2.0.1": {
      "weak-map": "npm:weak-map@1.0.5"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:q@2.0.2": {
      "asap": "npm:asap@1.0.0",
      "collections": "npm:collections@2.0.1",
      "fs": "github:jspm/nodelibs-fs@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.0"
    }
  }
});

