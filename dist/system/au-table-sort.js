'use strict';

System.register(['aurelia-framework', './au-table'], function (_export, _context) {
  "use strict";

  var inject, bindable, AureliaTableCustomAttribute, _createClass, _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, AutSortCustomAttribute;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      bindable = _aureliaFramework.bindable;
    }, function (_auTable) {
      AureliaTableCustomAttribute = _auTable.AureliaTableCustomAttribute;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('AutSortCustomAttribute', AutSortCustomAttribute = (_dec = inject(AureliaTableCustomAttribute, Element), _dec(_class = (_class2 = function () {
        _createClass(AutSortCustomAttribute, [{
          key: 'defaultOrder',
          get: function get() {
            if (!this.default) return undefined;

            return this.default === 'desc' ? -1 : 1;
          }
        }]);

        function AutSortCustomAttribute(auTable, element) {
          var _this = this;

          _classCallCheck(this, AutSortCustomAttribute);

          _initDefineProp(this, 'id', _descriptor, this);

          _initDefineProp(this, 'key', _descriptor2, this);

          _initDefineProp(this, 'custom', _descriptor3, this);

          _initDefineProp(this, 'type', _descriptor4, this);

          _initDefineProp(this, 'default', _descriptor5, this);

          this.order = 0;
          this.orderClasses = ['aut-desc', 'aut-sortable', 'aut-asc'];
          this.ignoreEvent = false;

          this.auTable = auTable;
          this.element = element;

          this.rowSelectedListener = function () {
            _this.handleHeaderClicked();
          };

          this.sortChangedListener = function () {
            _this.handleSortChanged();
          };
        }

        AutSortCustomAttribute.prototype.handleSortChanged = function handleSortChanged() {
          if (!this.ignoreEvent) {
            this.order = 0;
            this.setClass();
          } else {
            this.ignoreEvent = false;
          }
        };

        AutSortCustomAttribute.prototype.attached = function attached() {
          if (this.key === null && this.custom === null) {
            throw new Error('Must provide a key or a custom sort function.');
          }

          this.element.style.cursor = 'pointer';
          this.element.classList.add('aut-sort');

          this.element.addEventListener('click', this.rowSelectedListener);
          this.auTable.registerSortAttribute(this);

          this.handleDefault();
          this.setClass();
        };

        AutSortCustomAttribute.prototype.detached = function detached() {
          this.element.removeEventListener('click', this.rowSelectedListener);
          this.auTable.unregisterSortAttribute(this);
        };

        AutSortCustomAttribute.prototype.handleDefault = function handleDefault() {
          if (this.default) {
            this.auTable.setDefaultSort(this);
          }
        };

        AutSortCustomAttribute.prototype.doSort = function doSort() {
          this.ignoreEvent = true;

          this.auTable.sortChanged(this.key, this.type || undefined, this.custom || undefined, this.order);
        };

        AutSortCustomAttribute.prototype.setClass = function setClass() {
          var _this2 = this;

          this.orderClasses.forEach(function (next) {
            return _this2.element.classList.remove(next);
          });
          this.element.classList.add(this.orderClasses[this.order + 1]);
        };

        AutSortCustomAttribute.prototype.handleHeaderClicked = function handleHeaderClicked() {
          this.order = this.order === 0 || this.order === -1 ? this.order + 1 : -1;
          this.setClass();
          this.doSort();
        };

        AutSortCustomAttribute.prototype.setActive = function setActive(order) {
          this.order = order;
          this.setClass();
          this.doSort();
        };

        return AutSortCustomAttribute;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'id', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'key', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'custom', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'type', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'default', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class));

      _export('AutSortCustomAttribute', AutSortCustomAttribute);
    }
  };
});