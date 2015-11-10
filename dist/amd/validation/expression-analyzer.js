define(['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ExpressionAnalyzer = (function () {
    function ExpressionAnalyzer() {
      _classCallCheck(this, ExpressionAnalyzer);
    }

    ExpressionAnalyzer.prototype.getBreezeProperty = function getBreezeProperty(expression, source) {
      if (expression instanceof _aureliaBinding.ValueConverter) {
        return this.getBreezeProperty(expression.allArgs[0], source);
      }

      var entity = undefined;
      var propertyName = undefined;
      if (expression instanceof _aureliaBinding.AccessScope) {
        if (!source.entityAspect) {
          return null;
        }
        entity = source;
        propertyName = expression.name;
      }
      if (expression instanceof _aureliaBinding.AccessMember) {
        entity = expression.object.evaluate(source);
        if (!entity || !entity.entityAspect) {
          return null;
        }
        propertyName = expression.name;
      }
      if (expression instanceof _aureliaBinding.AccessKeyed) {
        entity = expression.object.evaluate(source);
        if (!entity || !entity.entityAspect) {
          return null;
        }
        propertyName = expression.key.evaluate(source);
      }

      if (propertyName === null || propertyName === undefined || !entity.entityType.getProperty(propertyName)) {
        return null;
      }

      return { entity: entity, propertyName: propertyName };
    };

    return ExpressionAnalyzer;
  })();

  exports.ExpressionAnalyzer = ExpressionAnalyzer;
});