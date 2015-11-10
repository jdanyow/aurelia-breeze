System.register(['aurelia-binding'], function (_export) {
  'use strict';

  var AccessMember, AccessScope, AccessKeyed, ValueConverter, ExpressionAnalyzer;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaBinding) {
      AccessMember = _aureliaBinding.AccessMember;
      AccessScope = _aureliaBinding.AccessScope;
      AccessKeyed = _aureliaBinding.AccessKeyed;
      ValueConverter = _aureliaBinding.ValueConverter;
    }],
    execute: function () {
      ExpressionAnalyzer = (function () {
        function ExpressionAnalyzer() {
          _classCallCheck(this, ExpressionAnalyzer);
        }

        ExpressionAnalyzer.prototype.getBreezeProperty = function getBreezeProperty(expression, source) {
          if (expression instanceof ValueConverter) {
            return this.getBreezeProperty(expression.allArgs[0], source);
          }

          var entity = undefined;
          var propertyName = undefined;
          if (expression instanceof AccessScope) {
            if (!source.entityAspect) {
              return null;
            }
            entity = source;
            propertyName = expression.name;
          }
          if (expression instanceof AccessMember) {
            entity = expression.object.evaluate(source);
            if (!entity || !entity.entityAspect) {
              return null;
            }
            propertyName = expression.name;
          }
          if (expression instanceof AccessKeyed) {
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

      _export('ExpressionAnalyzer', ExpressionAnalyzer);
    }
  };
});