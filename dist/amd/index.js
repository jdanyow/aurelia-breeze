define(['exports', './aurelia-breeze'], function (exports, _aureliaBreeze) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaBreeze).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaBreeze[key];
      }
    });
  });
});