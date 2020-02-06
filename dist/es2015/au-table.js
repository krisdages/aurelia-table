var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
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

import { inject, bindable, bindingMode, BindingEngine } from 'aurelia-framework';

function isNumeric(toCheck) {
  return !isNaN(parseFloat(toCheck)) && isFinite(toCheck);
}

function isNullOrEmpty(toCheck) {
  return toCheck == null || toCheck === '';
}

export const sortFunctions = {
  numeric: (a, b) => {
    if (a == null) return b == null ? 0 : -1;

    if (b == null) return 1;
    return a - b;
  },
  numericDemoteNull: [(a, b) => {
    if (a == null) return b == null ? 0 : 1;

    if (b == null) return -1;
    return a - b;
  }, (a, b) => {
    if (a == null) return b == null ? 0 : 1;

    if (b == null) return -1;
    return b - a;
  }],
  ascii: (a, b) => {
    if (a == null) a = '';

    if (b == null) b = '';

    return a < b ? -1 : a > b ? 1 : 0;
  },
  collator: (a, b) => AureliaTableCustomAttribute.collator.compare(a, b),
  auto: (a, b) => {
    if (a == null) a = '';

    if (b == null) b = '';

    if (isNumeric(a) && isNumeric(b)) {
      return a - b;
    }

    return AureliaTableCustomAttribute.collator.compare(a, b);
  }
};

export const updateTypes = Object.freeze({
  filter: "filter",
  sort: "sort",
  page: "page",
  data: "data"
});

export let AureliaTableCustomAttribute = (_dec = inject(BindingEngine), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec3 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec4 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec5 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec6 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec7 = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec(_class = (_class2 = (_temp = _class3 = class AureliaTableCustomAttribute {

  constructor(bindingEngine) {
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

  bind() {
    if (Array.isArray(this.data)) {
      this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(() => this.applyPlugins(updateTypes.data));
    }

    if (Array.isArray(this.filters)) {
      for (const filter of this.filters) {
        const observer = this.bindingEngine.propertyObserver(filter, 'value').subscribe(() => this.filterChanged());
        this.filterObservers.push(observer);
      }
    }

    if (Array.isArray(this.sortTypes)) {
      for (const _ref of this.sortTypes) {
        const { type, sortFunction } = _ref;

        if (type !== undefined && sortFunction !== undefined) {
          this.sortTypeMap.set(type, sortFunction);
        }
      }
    }

    this.api = {
      revealItem: item => this.revealItem(item)
    };
  }

  attached() {
    this.isAttached = true;
    this.applyPlugins(updateTypes.data);
  }

  detached() {
    if (this.dataObserver) {
      this.dataObserver.dispose();
    }

    for (let observer of this.filterObservers) {
      observer.dispose();
    }
  }

  filterChanged() {
    this.applyPlugins(updateTypes.filter);
    if (typeof this.onFilterChanged === "function") {
      this.onFilterChanged();
    }
  }

  currentPageChanged() {
    this.applyPlugins(updateTypes.page);
  }

  pageSizeChanged() {
    this.applyPlugins(updateTypes.page);
  }

  getDataCopy() {
    return [].concat(this.data);
  }

  applyPlugins(updateType) {
    if (this._isApplying) return;

    this._isApplying = true;

    try {
      this._applyPlugins(updateType);
    } finally {
      this._isApplying = false;
    }
  }

  _applyPlugins(updateType) {
    if (!this.isAttached || !this.data) {
      return;
    }

    if (updateType === updateTypes.filter) {
      if (this.hasPagination()) {
        this.currentPage = 1;
      }
    }

    const lastDataUpdate = { updateType };
    const result = { lastDataUpdate };

    let localData;
    if (updateType !== updateTypes.page || this.lastDataUpdate === undefined) {
      localData = this.getDataCopy();

      if (this.hasFilterValue()) {
        localData = this.doFilter(localData);
        lastDataUpdate.filterValues = this.filters.map(filter => filter.value);
      }

      const { sortKey, customSort, sortOrder } = this;
      if ((sortKey || customSort) && sortOrder !== 0) {
        this.doSort(localData);
        lastDataUpdate.sort = { sortOrder };
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
  }

  doFilter(toFilter) {
    if (this.filters.length === 1) {
      const filterFn = this.getFilterFn(this.filters[0]);
      return toFilter.filter(filterFn);
    }

    const filters = this.filters.map(filter => this.getFilterFn(filter));
    return toFilter.filter(item => {
      for (const filter of filters) {
        if (!filter(item)) {
          return false;
        }
      }
      return true;
    });
  }

  getFilterFn(filter) {
    let { custom, customValue, value: filterValue } = filter;
    if (customValue) {
      filterValue = customValue(filterValue);
    }

    if (typeof custom === 'function') {
      return item => custom(filterValue, item);
    }

    if (isNullOrEmpty(filterValue) || !Array.isArray(filter.keys)) {
      return () => true;
    }

    filterValue = filterValue.toString().toLowerCase();

    const valueFuncs = filter.keys.map(key => {
      const keyPaths = this.getKeyPaths(key);
      if (keyPaths.length === 1) {
        key = keyPaths[0];
        return item => item[key];
      }
      return item => this.getPropertyValue(item, keyPaths);
    });

    return item => {
      for (const valueFunc of valueFuncs) {
        let value = valueFunc(item);

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
  }

  doSort(toSort) {
    let sortFn;
    const { customSort, sortOrder = 1, sortKey, sortType = String } = this;
    if (typeof customSort === 'function') {
      sortFn = (a, b) => customSort(a, b, sortOrder);
      return toSort.sort(sortFn);
    }

    let sortFuncs = this.sortKeysMap.get(sortKey);
    if (sortFuncs === undefined) {
      sortFuncs = [];
      const sort = this.sortTypeMap.get(sortType) || sortFunctions.auto;
      let sortAsc, sortDesc;

      if (Array.isArray(sort)) {
        sortAsc = sort[0];
        sortDesc = sort[1];
      } else {
        sortAsc = sort;
        sortDesc = (a, b) => sortAsc(a, b) * -1;
      }
      if (typeof sortKey === 'function') {
        sortFuncs[-1] = (a, b) => sortDesc(sortKey(a, -1), sortKey(b, -1));
        sortFuncs[1] = (a, b) => sortAsc(sortKey(a, 1), sortKey(b, 1));
      } else {
        let keyPaths = this.getKeyPaths(sortKey);
        if (keyPaths.length === 1) {
          const key = keyPaths[0];
          sortFuncs[-1] = (a, b) => sortDesc(a[key], b[key]);
          sortFuncs[1] = (a, b) => sortAsc(a[key], b[key]);
        } else {
          sortFuncs[-1] = (a, b) => sortDesc(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths));
          sortFuncs[1] = (a, b) => sortAsc(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths));
        }
      }
      this.sortKeysMap.set(sortKey, sortFuncs);
    }
    return toSort.sort(sortFuncs[sortOrder]);
  }

  getKeyPaths(keyPath) {
    if (Array.isArray(keyPath)) return keyPath;

    keyPath = keyPath.replace(/\[(\w+)\]/g, '.$1');
    keyPath = keyPath.replace(/^\./, '');
    return keyPath.split('.');
  }

  getPropertyValue(object, keyPaths) {
    for (let i = 0, n = keyPaths.length; i < n; ++i) {
      let k = keyPaths[i];
      if (k in object) {
        object = object[k];
      } else {
        return;
      }
    }
    return object;
  }

  doPaginate(toPaginate) {
    if (toPaginate.length <= this.pageSize) {
      return toPaginate;
    }

    let start = (this.currentPage - 1) * this.pageSize;

    let end = start + this.pageSize;

    return toPaginate.slice(start, end);
  }

  hasFilter() {
    return Array.isArray(this.filters) && this.filters.length > 0;
  }

  hasFilterValue() {
    if (!this.hasFilter()) return false;

    return this.filters.some(filter => !isNullOrEmpty(filter.value));
  }

  hasPagination() {
    return this.currentPage > 0 && this.pageSize > 0;
  }

  dataChanged() {
    if (this.dataObserver) {
      this.dataObserver.dispose();
    }

    let data = this.data;
    if (data == undefined) {
      data = [];
    }

    this.dataObserver = this.bindingEngine.collectionObserver(data).subscribe(() => this.applyPlugins(updateTypes.data));

    this.applyPlugins(updateTypes.data);
  }

  sortChanged(key, type, custom, order) {
    this.sortKey = key;
    this.sortType = type;
    this.customSort = custom;
    this.sortOrder = order;
    this.pendingSort = undefined;
    this.applyPlugins(updateTypes.sort);
    this.emitSortChanged();
  }

  registerSortAttribute(sortAttribute) {
    this.sortAttributes.add(sortAttribute);
    const { key, id } = sortAttribute;
    if (id !== undefined) {
      this.sortAttributesById.set(sortAttribute.id, sortAttribute);
    }
    if (this.pendingSort !== undefined) {
      const { id: pendingId, key: pendingKey, order } = this.pendingSort;
      if (pendingId !== undefined) {
        if (id === pendingId) {
          sortAttribute.setActive(order);
        }
      } else if (pendingKey !== undefined && key === pendingKey) {
        sortAttribute.setActive(order);
      }
    }
  }

  unregisterSortAttribute(sortAttribute) {
    this.sortAttributes.delete(sortAttribute);
    if (sortAttribute.id !== undefined) {
      this.sortAttributesById.delete(sortAttribute.id);
    }
  }

  setDefaultSort(sortAttribute) {
    if (this.sortKey === undefined) {
      sortAttribute.setActive(sortAttribute.defaultOrder);
    }
  }

  clearSort() {
    this.sortChanged(undefined, undefined, undefined, 0);
  }

  sortByAttributeId(id, order) {
    const attribute = this.sortAttributesById.get(id);
    if (attribute !== undefined) {
      attribute.setActive(order);
    } else {
      this.pendingSort = { id, order };
    }
  }

  sortByKey(key, order) {
    for (const attribute of this.sortAttributes) {
      if (attribute.key !== key) continue;

      attribute.setActive(order);
      return;
    }

    this.pendingSort = { key, order };
  }

  emitSortChanged() {
    for (const attribute of this.sortAttributes) {
      attribute.sortChangedListener();
    }
  }

  revealItem(item) {
    if (!this.hasPagination()) {
      return true;
    }

    let index = this.displayDataUnpaged.indexOf(item);

    if (index === -1) {
      return false;
    }

    this.currentPage = Math.ceil((index + 1) / this.pageSize);

    return true;
  }

}, _class3.collator = new Intl.Collator(undefined, { numeric: true }), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'displayData', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'displayDataUnpaged', [_dec3], {
  enumerable: true,
  initializer: function () {
    return [];
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'lastDataUpdate', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'filters', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'sortTypes', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'currentPage', [_dec5], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'pageSize', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'totalItems', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'api', [_dec7], {
  enumerable: true,
  initializer: null
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'onFilterChanged', [bindable], {
  enumerable: true,
  initializer: null
})), _class2)) || _class);