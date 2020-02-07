define(['exports', 'aurelia-framework', './au-table'], function (exports, _aureliaFramework, _auTable) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AutSortCustomAttribute = undefined;

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

  var _createClass = function () {
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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var AutSortCustomAttribute = exports.AutSortCustomAttribute = (_dec = (0, _aureliaFramework.inject)(_auTable.AureliaTableCustomAttribute, Element), _dec(_class = (_class2 = function () {
    AutSortCustomAttribute.prototype.defaultChanged = function defaultChanged() {
      if (this.isAttached) {
        this.auTable.setSortAttributeDirty(this);
      }
    };

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

      this.isAttached = false;
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
      if (this.key == null && this.custom == null) {
        throw new Error('Must provide a key or a custom sort function.');
      }

      this.element.style.cursor = 'pointer';
      this.element.classList.add('aut-sort');

      this.element.addEventListener('click', this.rowSelectedListener);
      this.auTable.registerSortAttribute(this);

      this.setClass();
      this.isAttached = true;
    };

    AutSortCustomAttribute.prototype.detached = function detached() {
      this.element.removeEventListener('click', this.rowSelectedListener);
      this.auTable.unregisterSortAttribute(this);
      this.isAttached = false;
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
      var triggerSortChanged = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.order = order;
      this.setClass();
      if (triggerSortChanged) {
        this.doSort();
      }
    };

    return AutSortCustomAttribute;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'id', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'key', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'custom', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'type', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'default', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});