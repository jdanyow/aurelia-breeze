'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ErrorRenderer = (function () {
  function ErrorRenderer() {
    _classCallCheck(this, ErrorRenderer);
  }

  ErrorRenderer.prototype.render = function render(rootElement, error, property) {
    throw new Error('An error renderer must implement "render".');
  };

  ErrorRenderer.prototype.unrender = function unrender(rootElement, error, property) {
    throw new Error('An error renderer must implement "unrender".');
  };

  return ErrorRenderer;
})();

exports.ErrorRenderer = ErrorRenderer;