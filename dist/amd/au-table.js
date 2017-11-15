define(['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AureliaTableCustomAttribute = exports.sortFunctions = undefined;

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

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _class3, _temp;

  function isNumeric(toCheck) {
    return !isNaN(parseFloat(toCheck)) && isFinite(toCheck);
  }

  function isNullOrEmpty(toCheck) {
    return toCheck == null || toCheck === '';
  }

  var sortFunctions = exports.sortFunctions = {
    numeric: function numeric(a, b) {
      if (a == null) return b == null ? 0 : -1;

      if (b == null) return 1;
      return a - b;
    },
    ascii: function ascii(a, b) {
      if (a == null) a = '';

      if (b == null) b = '';

      return a < b ? -1 : a > b ? 1 : 0;
    },
    collator: function collator(a, b) {
      return AureliaTableCustomAttribute.collator.compare(a, b);
    },
    auto: function auto(a, b) {
      if (a == null) a = '';

      if (b == null) b = '';

      if (isNumeric(a) && isNumeric(b)) {
        return a - b;
      }

      return AureliaTableCustomAttribute.collator.compare(a, b);
    }
  };

  var AureliaTableCustomAttribute = exports.AureliaTableCustomAttribute = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.BindingEngine), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec5 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = (_temp = _class3 = function () {
    function AureliaTableCustomAttribute(bindingEngine) {
      _classCallCheck(this, AureliaTableCustomAttribute);

      _initDefineProp(this, 'data', _descriptor, this);

      _initDefineProp(this, 'displayData', _descriptor2, this);

      _initDefineProp(this, 'filters', _descriptor3, this);

      _initDefineProp(this, 'sortTypes', _descriptor4, this);

      _initDefineProp(this, 'currentPage', _descriptor5, this);

      _initDefineProp(this, 'pageSize', _descriptor6, this);

      _initDefineProp(this, 'totalItems', _descriptor7, this);

      _initDefineProp(this, 'api', _descriptor8, this);

      _initDefineProp(this, 'onFilterChanged', _descriptor9, this);

      this.isAttached = false;
      this.sortChangedListeners = [];
      this.sortTypeMap = new Map([[Number, sortFunctions.numeric], [Boolean, sortFunctions.numeric], [String, sortFunctions.ascii], [Date, sortFunctions.numeric], [Intl.Collator, sortFunctions.collator], ['auto', sortFunctions.auto]]);
      this.sortKeysMap = new Map();
      this.beforePagination = [];
      this.filterObservers = [];

      this.bindingEngine = bindingEngine;
    }

    AureliaTableCustomAttribute.prototype.bind = function bind() {
      var _this = this;

      if (Array.isArray(this.data)) {
        this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(function () {
          return _this.applyPlugins();
        });
      }

      if (Array.isArray(this.filters)) {
        for (var _iterator = this.filters, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var filter = _ref;

          var observer = this.bindingEngine.propertyObserver(filter, 'value').subscribe(function () {
            return _this.filterChanged();
          });
          this.filterObservers.push(observer);
        }
      }

      if (Array.isArray(this.sortTypes)) {
        for (var _iterator2 = this.sortTypes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref3 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref3 = _i2.value;
          }

          var _ref4 = _ref3;
          var type = _ref4.type,
              sortFunction = _ref4.sortFunction;

          if (type !== undefined && sortFunction !== undefined) {
            this.sortTypeMap.set(type, sortFunction);
          }
        }
      }

      this.api = {
        revealItem: function revealItem(item) {
          return _this.revealItem(item);
        }
      };
    };

    AureliaTableCustomAttribute.prototype.attached = function attached() {
      this.isAttached = true;
      this.applyPlugins();
    };

    AureliaTableCustomAttribute.prototype.detached = function detached() {
      if (this.dataObserver) {
        this.dataObserver.dispose();
      }

      for (var _iterator3 = this.filterObservers, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref5 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref5 = _i3.value;
        }

        var observer = _ref5;

        observer.dispose();
      }
    };

    AureliaTableCustomAttribute.prototype.filterChanged = function filterChanged() {
      if (this.hasPagination()) {
        this.currentPage = 1;
      }
      this.applyPlugins();
      if (typeof this.onFilterChanged === "function") {
        this.onFilterChanged();
      }
    };

    AureliaTableCustomAttribute.prototype.currentPageChanged = function currentPageChanged() {
      this.applyPlugins();
    };

    AureliaTableCustomAttribute.prototype.pageSizeChanged = function pageSizeChanged() {
      this.applyPlugins();
    };

    AureliaTableCustomAttribute.prototype.getDataCopy = function getDataCopy() {
      return [].concat(this.data);
    };

    AureliaTableCustomAttribute.prototype.applyPlugins = function applyPlugins() {
      if (!this.isAttached || !this.data) {
        return;
      }

      var localData = this.getDataCopy();

      if (this.hasFilter()) {
        localData = this.doFilter(localData);
      }

      if ((this.sortKey || this.customSort) && this.sortOrder !== 0) {
        this.doSort(localData);
      }

      this.totalItems = localData.length;

      if (this.hasPagination()) {
        this.beforePagination = [].concat(localData);
        localData = this.doPaginate(localData);
      }

      this.displayData = localData;
    };

    AureliaTableCustomAttribute.prototype.doFilter = function doFilter(toFilter) {
      var _this2 = this;

      var hasFilterValue = this.filters.some(function (filter) {
        return !isNullOrEmpty(filter.value);
      });
      if (!hasFilterValue) {
        return toFilter;
      }

      if (this.filters.length === 1) {
        var filterFn = this.getFilterFn(this.filters[0]);
        return toFilter.filter(filterFn);
      }

      var filters = this.filters.map(function (filter) {
        return _this2.getFilterFn(filter);
      });
      return toFilter.filter(function (item) {
        for (var _iterator4 = filters, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref6 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref6 = _i4.value;
          }

          var filter = _ref6;

          if (!filter(item)) {
            return false;
          }
        }
        return true;
      });
    };

    AureliaTableCustomAttribute.prototype.getFilterFn = function getFilterFn(filter) {
      var _this3 = this;

      var custom = filter.custom,
          customValue = filter.customValue,
          filterValue = filter.value;

      if (customValue) {
        filterValue = customValue(filterValue);
      }

      if (typeof custom === 'function') {
        return function (item) {
          return custom(filterValue, item);
        };
      }

      if (isNullOrEmpty(filterValue) || !Array.isArray(filter.keys)) {
        return function () {
          return true;
        };
      }

      filterValue = filterValue.toString().toLowerCase();

      var valueFuncs = filter.keys.map(function (key) {
        var keyPaths = _this3.getKeyPaths(key);
        if (keyPaths.length === 1) {
          key = keyPaths[0];
          return function (item) {
            return item[key];
          };
        }
        return function (item) {
          return _this3.getPropertyValue(item, keyPaths);
        };
      });

      return function (item) {
        for (var _iterator5 = valueFuncs, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
          var _ref7;

          if (_isArray5) {
            if (_i5 >= _iterator5.length) break;
            _ref7 = _iterator5[_i5++];
          } else {
            _i5 = _iterator5.next();
            if (_i5.done) break;
            _ref7 = _i5.value;
          }

          var valueFunc = _ref7;

          var value = valueFunc(item);

          if (value == null) {
            continue;
          }
          value = value.toString().toLowerCase();
          if (value.indexOf(filterValue) > -1) {
            return true;
          }
        }
        return false;
      };
    };

    AureliaTableCustomAttribute.prototype.doSort = function doSort(toSort) {
      var _this4 = this;

      var sortFn = void 0;
      var customSort = this.customSort,
          _sortOrder = this.sortOrder,
          sortOrder = _sortOrder === undefined ? 1 : _sortOrder,
          sortKey = this.sortKey,
          _sortType = this.sortType,
          sortType = _sortType === undefined ? String : _sortType;

      if (typeof customSort === 'function') {
        sortFn = function sortFn(a, b) {
          return customSort(a, b, sortOrder);
        };
        return toSort.sort(sortFn);
      }

      var sortFuncs = this.sortKeysMap.get(sortKey);
      if (sortFuncs === undefined) {
        sortFuncs = [];
        var sort = this.sortTypeMap.get(sortType) || sortFunctions.auto;
        if (typeof sortKey === 'function') {
          sortFuncs[-1] = function (a, b) {
            return sort(sortKey(a), sortKey(b)) * -1;
          };
          sortFuncs[1] = function (a, b) {
            return sort(sortKey(a), sortKey(b));
          };
        } else {
          var keyPaths = this.getKeyPaths(sortKey);
          if (keyPaths.length === 1) {
            var key = keyPaths[0];
            sortFuncs[-1] = function (a, b) {
              return sort(a[key], b[key]) * -1;
            };
            sortFuncs[1] = function (a, b) {
              return sort(a[key], b[key]);
            };
          } else {
            sortFuncs[-1] = function (a, b) {
              return sort(_this4.getPropertyValue(a, keyPaths), _this4.getPropertyValue(b, keyPaths)) * -1;
            };
            sortFuncs[1] = function (a, b) {
              return sort(_this4.getPropertyValue(a, keyPaths), _this4.getPropertyValue(b, keyPaths));
            };
          }
        }
        this.sortKeysMap.set(sortKey, sortFuncs);
      }
      return toSort.sort(sortFuncs[sortOrder]);
    };

    AureliaTableCustomAttribute.prototype.getKeyPaths = function getKeyPaths(keyPath) {
      keyPath = keyPath.replace(/\[(\w+)\]/g, '.$1');
      keyPath = keyPath.replace(/^\./, '');
      return keyPath.split('.');
    };

    AureliaTableCustomAttribute.prototype.getPropertyValue = function getPropertyValue(object, keyPaths) {
      for (var i = 0, n = keyPaths.length; i < n; ++i) {
        var k = keyPaths[i];
        if (k in object) {
          object = object[k];
        } else {
          return;
        }
      }
      return object;
    };

    AureliaTableCustomAttribute.prototype.doPaginate = function doPaginate(toPaginate) {
      if (toPaginate.length <= this.pageSize) {
        return toPaginate;
      }

      var start = (this.currentPage - 1) * this.pageSize;

      var end = start + this.pageSize;

      return toPaginate.slice(start, end);
    };

    AureliaTableCustomAttribute.prototype.hasFilter = function hasFilter() {
      return Array.isArray(this.filters) && this.filters.length > 0;
    };

    AureliaTableCustomAttribute.prototype.hasPagination = function hasPagination() {
      return this.currentPage > 0 && this.pageSize > 0;
    };

    AureliaTableCustomAttribute.prototype.dataChanged = function dataChanged() {
      var _this5 = this;

      if (this.dataObserver) {
        this.dataObserver.dispose();
      }

      this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(function () {
        return _this5.applyPlugins();
      });

      this.applyPlugins();
    };

    AureliaTableCustomAttribute.prototype.sortChanged = function sortChanged(key, type, custom, order) {
      this.sortKey = key;
      this.sortType = type;
      this.customSort = custom;
      this.sortOrder = order;
      this.applyPlugins();
      this.emitSortChanged();
    };

    AureliaTableCustomAttribute.prototype.addSortChangedListener = function addSortChangedListener(callback) {
      this.sortChangedListeners.push(callback);
    };

    AureliaTableCustomAttribute.prototype.removeSortChangedListener = function removeSortChangedListener(callback) {
      this.removeListener(callback, this.sortChangedListeners);
    };

    AureliaTableCustomAttribute.prototype.emitSortChanged = function emitSortChanged() {
      for (var _iterator6 = this.sortChangedListeners, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray6) {
          if (_i6 >= _iterator6.length) break;
          _ref8 = _iterator6[_i6++];
        } else {
          _i6 = _iterator6.next();
          if (_i6.done) break;
          _ref8 = _i6.value;
        }

        var listener = _ref8;

        listener();
      }
    };

    AureliaTableCustomAttribute.prototype.removeListener = function removeListener(callback, listeners) {
      var index = listeners.indexOf(callback);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };

    AureliaTableCustomAttribute.prototype.revealItem = function revealItem(item) {
      if (!this.hasPagination()) {
        return true;
      }

      var index = this.beforePagination.indexOf(item);

      if (index === -1) {
        return false;
      }

      this.currentPage = Math.ceil((index + 1) / this.pageSize);

      return true;
    };

    return AureliaTableCustomAttribute;
  }(), _class3.collator = new Intl.Collator(undefined, { numeric: true }), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'displayData', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'sortTypes', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'currentPage', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'totalItems', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'api', [_dec5], {
    enumerable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'onFilterChanged', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});