System.register([], function (_export) {
  "use strict";

  var _prototypeProperties, _classCallCheck, BreezePropertyObserver, BreezeObjectObserver;
  return {
    setters: [],
    execute: function () {
      _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      BreezePropertyObserver = _export("BreezePropertyObserver", (function () {
        function BreezePropertyObserver(owner, obj, propertyName) {
          _classCallCheck(this, BreezePropertyObserver);

          this.owner = owner;
          this.obj = obj;
          this.propertyName = propertyName;
          this.callbacks = [];
          this.isSVG = false;
        }

        _prototypeProperties(BreezePropertyObserver, null, {
          getValue: {
            value: function getValue() {
              return this.obj[this.propertyName];
            },
            writable: true,
            configurable: true
          },
          setValue: {
            value: function setValue(newValue) {
              this.obj[this.propertyName] = newValue;
            },
            writable: true,
            configurable: true
          },
          trigger: {
            value: function trigger(newValue, oldValue) {
              var callbacks = this.callbacks,
                  i = callbacks.length;

              while (i--) {
                callbacks[i](newValue, oldValue);
              }
            },
            writable: true,
            configurable: true
          },
          subscribe: {
            value: function subscribe(callback) {
              return this.owner.subscribe(this, callback);
            },
            writable: true,
            configurable: true
          }
        });

        return BreezePropertyObserver;
      })());
      BreezeObjectObserver = _export("BreezeObjectObserver", (function () {
        function BreezeObjectObserver(obj) {
          _classCallCheck(this, BreezeObjectObserver);

          this.obj = obj;
          this.observers = {};
        }

        _prototypeProperties(BreezeObjectObserver, null, {
          subscribe: {
            value: function subscribe(propertyObserver, callback) {
              var _this = this;
              var callbacks = propertyObserver.callbacks;
              callbacks.push(callback);

              if (!this.observing) {
                this.observing = true;
                this.subscription = this.obj.entityAspect.propertyChanged.subscribe(function (args) {
                  _this.handleChanges([{ name: args.propertyName, object: args.entity, type: "update", oldValue: args.oldValue }]);
                });
              }

              return (function () {
                callbacks.splice(callbacks.indexOf(callback), 1);
                if (callbacks.length > 0) return;
                this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
                this.observing = false;
              }).bind(this);
            },
            writable: true,
            configurable: true
          },
          getObserver: {
            value: function getObserver(propertyName) {
              var propertyObserver = this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this, this.obj, propertyName));

              return propertyObserver;
            },
            writable: true,
            configurable: true
          },
          handleChanges: {
            value: function handleChanges(changeRecords) {
              var updates = {},
                  observers = this.observers,
                  i = changeRecords.length;

              while (i--) {
                var change = changeRecords[i],
                    name = change.name;

                if (!(name in updates)) {
                  var observer = observers[name];
                  updates[name] = true;
                  if (observer) {
                    observer.trigger(change.object[name], change.oldValue);
                  }
                }
              }
            },
            writable: true,
            configurable: true
          }
        });

        return BreezeObjectObserver;
      })());
    }
  };
});