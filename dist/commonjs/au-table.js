'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AureliaTableCustomAttribute = exports.updateTypes = exports.sortFunctions = undefined;

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _temp;

var _aureliaFramework = require('aurelia-framework');

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  numericDemoteNull: [function (a, b) {
    if (a == null) return b == null ? 0 : 1;

    if (b == null) return -1;
    return a - b;
  }, function (a, b) {
    if (a == null) return b == null ? 0 : 1;

    if (b == null) return -1;
    return b - a;
  }],
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

var updateTypes = exports.updateTypes = Object.freeze({
  filter: "filter",
  sort: "sort",
  page: "page",
  data: "data"
});

var AureliaTableCustomAttribute = exports.AureliaTableCustomAttribute = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.BindingEngine), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec4 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec5 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec6 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec7 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = (_temp = _class3 = function () {
  function AureliaTableCustomAttribute(bindingEngine) {
    _classCallCheck(this, AureliaTableCustomAttribute);

    _initDefineProp(this, 'data', _descriptor, this);

    _initDefineProp(this, 'displayData', _descriptor2, this);

    _initDefineProp(this, 'displayDataUnpaged', _descriptor3, this);

    _initDefineProp(this, 'lastDataUpdate', _descriptor4, this);

    _initDefineProp(this, 'filters', _descriptor5, this);

    _initDefineProp(this, 'sortTypes', _descriptor6, this);

    _initDefineProp(this, 'currentPage', _descriptor7, this);

    _initDefineProp(this, 'pageSize', _descriptor8, this);

    _initDefineProp(this, 'totalItems', _descriptor9, this);

    _initDefineProp(this, 'api', _descriptor10, this);

    _initDefineProp(this, 'onFilterChanged', _descriptor11, this);

    this.isAttached = false;
    this.sortAttributes = new Set();
    this.sortAttributesById = new Map();
    this.sortTypeMap = new Map([[Number, sortFunctions.numeric], [Boolean, sortFunctions.numeric], [String, sortFunctions.ascii], [Date, sortFunctions.numeric], [Intl.Collator, sortFunctions.collator], ['auto', sortFunctions.auto]]);
    this.sortKeysMap = new Map();
    this.filterObservers = [];
    this._isApplying = false;

    this.bindingEngine = bindingEngine;
  }

  AureliaTableCustomAttribute.prototype.bind = function bind() {
    var _this = this;

    if (Array.isArray(this.data)) {
      this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(function () {
        return _this.applyPlugins(updateTypes.data);
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
    this.applyPlugins(updateTypes.data);
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
    this.applyPlugins(updateTypes.filter);
    if (typeof this.onFilterChanged === "function") {
      this.onFilterChanged();
    }
  };

  AureliaTableCustomAttribute.prototype.currentPageChanged = function currentPageChanged() {
    this.applyPlugins(updateTypes.page);
  };

  AureliaTableCustomAttribute.prototype.pageSizeChanged = function pageSizeChanged() {
    this.applyPlugins(updateTypes.page);
  };

  AureliaTableCustomAttribute.prototype.getDataCopy = function getDataCopy() {
    return [].concat(this.data);
  };

  AureliaTableCustomAttribute.prototype.applyPlugins = function applyPlugins(updateType) {
    if (this._isApplying) return;

    this._isApplying = true;

    try {
      this._applyPlugins(updateType);
    } finally {
      this._isApplying = false;
    }
  };

  AureliaTableCustomAttribute.prototype._applyPlugins = function _applyPlugins(updateType) {
    if (!this.isAttached || !this.data) {
      return;
    }

    if (updateType === updateTypes.filter) {
      if (this.hasPagination()) {
        this.currentPage = 1;
      }
    }

    var lastDataUpdate = { updateType: updateType };
    var result = { lastDataUpdate: lastDataUpdate };

    var localData = void 0;
    if (updateType !== updateTypes.page || this.lastDataUpdate === undefined) {
      localData = this.getDataCopy();

      if (this.hasFilterValue()) {
        localData = this.doFilter(localData);
        lastDataUpdate.filterValues = this.filters.map(function (filter) {
          return filter.value;
        });
      }

      var sortKey = this.sortKey,
          customSort = this.customSort,
          sortOrder = this.sortOrder;

      if ((sortKey || customSort) && sortOrder !== 0) {
        this.doSort(localData);
        lastDataUpdate.sort = { sortOrder: sortOrder };
        if (customSort) {
          lastDataUpdate.sort.customSort = customSort;
        }
        if (sortKey) {
          lastDataUpdate.sort.sortKey = sortKey;
        }
      }

      result.totalItems = localData.length;
      result.displayDataUnpaged = localData;
    } else {
      localData = this.displayDataUnpaged;
    }

    lastDataUpdate.displayDataUnpaged = localData;

    if (this.hasPagination()) {
      localData = this.doPaginate(localData);
    }

    lastDataUpdate.displayData = result.displayData = localData;
    Object.assign(this, result);
  };

  AureliaTableCustomAttribute.prototype.doFilter = function doFilter(toFilter) {
    var _this2 = this;

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
      var sortAsc = void 0,
          sortDesc = void 0;

      if (Array.isArray(sort)) {
        sortAsc = sort[0];
        sortDesc = sort[1];
      } else {
        sortAsc = sort;
        sortDesc = function sortDesc(a, b) {
          return sortAsc(a, b) * -1;
        };
      }
      if (typeof sortKey === 'function') {
        sortFuncs[-1] = function (a, b) {
          return sortDesc(sortKey(a, -1), sortKey(b, -1));
        };
        sortFuncs[1] = function (a, b) {
          return sortAsc(sortKey(a, 1), sortKey(b, 1));
        };
      } else {
        var keyPaths = this.getKeyPaths(sortKey);
        if (keyPaths.length === 1) {
          var key = keyPaths[0];
          sortFuncs[-1] = function (a, b) {
            return sortDesc(a[key], b[key]);
          };
          sortFuncs[1] = function (a, b) {
            return sortAsc(a[key], b[key]);
          };
        } else {
          sortFuncs[-1] = function (a, b) {
            return sortDesc(_this4.getPropertyValue(a, keyPaths), _this4.getPropertyValue(b, keyPaths));
          };
          sortFuncs[1] = function (a, b) {
            return sortAsc(_this4.getPropertyValue(a, keyPaths), _this4.getPropertyValue(b, keyPaths));
          };
        }
      }
      this.sortKeysMap.set(sortKey, sortFuncs);
    }
    return toSort.sort(sortFuncs[sortOrder]);
  };

  AureliaTableCustomAttribute.prototype.getKeyPaths = function getKeyPaths(keyPath) {
    if (Array.isArray(keyPath)) return keyPath;

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

  AureliaTableCustomAttribute.prototype.hasFilterValue = function hasFilterValue() {
    if (!this.hasFilter()) return false;

    return this.filters.some(function (filter) {
      return !isNullOrEmpty(filter.value);
    });
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
      return _this5.applyPlugins(updateTypes.data);
    });

    this.applyPlugins(updateTypes.data);
  };

  AureliaTableCustomAttribute.prototype.sortChanged = function sortChanged(key, type, custom, order) {
    this.sortKey = key;
    this.sortType = type;
    this.customSort = custom;
    this.sortOrder = order;
    this.pendingSort = undefined;
    this.applyPlugins(updateTypes.sort);
    this.emitSortChanged();
  };

  AureliaTableCustomAttribute.prototype.registerSortAttribute = function registerSortAttribute(sortAttribute) {
    this.sortAttributes.add(sortAttribute);
    var key = sortAttribute.key,
        id = sortAttribute.id;

    if (id !== undefined) {
      this.sortAttributesById.set(sortAttribute.id, sortAttribute);
    }
    if (this.pendingSort !== undefined) {
      var _pendingSort = this.pendingSort,
          pendingId = _pendingSort.id,
          pendingKey = _pendingSort.key,
          order = _pendingSort.order;

      if (pendingId !== undefined) {
        if (id === pendingId) {
          sortAttribute.setActive(order);
        }
      } else if (pendingKey !== undefined && key === pendingKey) {
        sortAttribute.setActive(order);
      }
    }
  };

  AureliaTableCustomAttribute.prototype.unregisterSortAttribute = function unregisterSortAttribute(sortAttribute) {
    this.sortAttributes.delete(sortAttribute);
    if (sortAttribute.id !== undefined) {
      this.sortAttributesById.delete(sortAttribute.id);
    }
  };

  AureliaTableCustomAttribute.prototype.setDefaultSort = function setDefaultSort(sortAttribute) {
    if (this.sortKey === undefined) {
      sortAttribute.setActive(sortAttribute.defaultOrder);
    }
  };

  AureliaTableCustomAttribute.prototype.clearSort = function clearSort() {
    this.sortChanged(undefined, undefined, undefined, 0);
  };

  AureliaTableCustomAttribute.prototype.sortByAttributeId = function sortByAttributeId(id, order) {
    var attribute = this.sortAttributesById.get(id);
    if (attribute !== undefined) {
      attribute.setActive(order);
    } else {
      this.pendingSort = { id: id, order: order };
    }
  };

  AureliaTableCustomAttribute.prototype.sortByKey = function sortByKey(key, order) {
    for (var _iterator6 = this.sortAttributes, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
      var _ref8;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref8 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref8 = _i6.value;
      }

      var attribute = _ref8;

      if (attribute.key !== key) continue;

      attribute.setActive(order);
      return;
    }

    this.pendingSort = { key: key, order: order };
  };

  AureliaTableCustomAttribute.prototype.emitSortChanged = function emitSortChanged() {
    for (var _iterator7 = this.sortAttributes, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
      var _ref9;

      if (_isArray7) {
        if (_i7 >= _iterator7.length) break;
        _ref9 = _iterator7[_i7++];
      } else {
        _i7 = _iterator7.next();
        if (_i7.done) break;
        _ref9 = _i7.value;
      }

      var attribute = _ref9;

      attribute.sortChangedListener();
    }
  };

  AureliaTableCustomAttribute.prototype.revealItem = function revealItem(item) {
    if (!this.hasPagination()) {
      return true;
    }

    var index = this.displayDataUnpaged.indexOf(item);

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
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'displayDataUnpaged', [_dec3], {
  enumerable: true,
  initializer: function initializer() {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'lastDataUpdate', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'sortTypes', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'currentPage', [_dec5], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'totalItems', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'api', [_dec7], {
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'onFilterChanged', [_aureliaFramework.bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class);