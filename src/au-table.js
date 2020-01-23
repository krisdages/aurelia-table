import {inject, bindable, bindingMode, BindingEngine} from 'aurelia-framework';

function isNumeric(toCheck) {
  return !isNaN(parseFloat(toCheck)) && isFinite(toCheck);
}

function isNullOrEmpty(toCheck) {
  //Match null or undefined.
  // eslint-disable-next-line eqeqeq,no-eq-null
  return toCheck == null || toCheck === '';
}

export const sortFunctions = {
  numeric: (a, b) => {
    //Match null or undefined.
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (a == null) return (b == null) ? 0 : -1;
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (b == null) return 1;
    return a - b;
  },
  numericDemoteNull: [
    (a, b) => {
      // eslint-disable-next-line eqeqeq,no-eq-null
      if (a == null) return (b == null) ? 0 : 1;
      // eslint-disable-next-line eqeqeq,no-eq-null
      if (b == null) return -1;
      return a - b;
    },
    (a, b) => {
      // eslint-disable-next-line eqeqeq,no-eq-null
      if (a == null) return (b == null) ? 0 : 1;
      // eslint-disable-next-line eqeqeq,no-eq-null
      if (b == null) return -1;
      return b - a;
    }
  ],
  ascii: (a, b) => {
    //Match null or undefined.
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (a == null) a = '';
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (b == null) b = '';
    // eslint-disable-next-line no-nested-ternary
    return (a < b ? -1 : (a > b ? 1 : 0));
  },
  collator: (a, b) => AureliaTableCustomAttribute.collator.compare(a, b),
  auto: (a, b) => {
    //Match null or undefined.
    // eslint-disable-next-line eqeqeq,no-eq-null
    if (a == null) a = '';
    // eslint-disable-next-line eqeqeq,no-eq-null
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

@inject(BindingEngine)
export class AureliaTableCustomAttribute {

  static collator = new Intl.Collator(undefined, { numeric: true });

  @bindable data;
  @bindable({defaultBindingMode: bindingMode.twoWay}) displayData;
  @bindable({defaultBindingMode: bindingMode.twoWay}) displayDataUnpaged = [];
  @bindable({defaultBindingMode: bindingMode.twoWay}) lastDataUpdate;

  @bindable filters;
  @bindable sortTypes;

  @bindable({defaultBindingMode: bindingMode.twoWay}) currentPage;
  @bindable pageSize;
  @bindable({defaultBindingMode: bindingMode.twoWay}) totalItems;

  @bindable({defaultBindingMode: bindingMode.twoWay}) api;

  @bindable onFilterChanged;

  isAttached = false;

  sortKey;
  sortType;
  sortOrder;
  sortAttributes = new Set();
  sortAttributesById = new Map();
  sortTypeMap = new Map([
    [Number, sortFunctions.numeric],
    [Boolean, sortFunctions.numeric],
    [String, sortFunctions.ascii],
    [Date, sortFunctions.numeric],
    [Intl.Collator, sortFunctions.collator],
    ['auto', sortFunctions.auto]
  ]);
  sortKeysMap = new Map();
  //Sort config object set if explicitly sorted by a key / id that is not present.
  //Will sort by this if a matching sort attribute is registered before sort is changed.
  pendingSort;

  dataObserver;
  filterObservers = [];

  constructor(bindingEngine) {
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
      for (const { type, sortFunction } of this.sortTypes) {
        if (type !== undefined && sortFunction !== undefined) {
          this.sortTypeMap.set(type, sortFunction);
        }
      }
    }

    this.api = {
      revealItem: (item) => this.revealItem(item)
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

  /**
   * Copies the data into the display data
   */
  getDataCopy() {
    return [].concat(this.data);
  }

  //Private flag used to prevent recursively calling applyPlugins.
  _isApplying = false;
  /**
   * Applies all the plugins to the display data
   */
  applyPlugins(updateType) {
    //Don't call recursively.
    if (this._isApplying)
      return;

    this._isApplying = true;

    try {
      this._applyPlugins(updateType);
    }
    finally {
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

      let localData; //array of items. If paging we don't need to repeat the sort and filter.
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

      }
      else {
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
    //If there is only one filter, skip inner loop over filters.
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

    return (item) => {
      for (const valueFunc of valueFuncs) {
        let value = valueFunc(item);
        //Match null and undefined.
        // eslint-disable-next-line eqeqeq,no-eq-null
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
      //If a tuple of functions [sortAsc, sortDesc] are registered for the sort type,
      //use sortDesc for descending sort instead of multiplying the sortAsc result by -1.
      if (Array.isArray(sort)) {
          sortAsc = sort[0];
          sortDesc = sort[1];
      }
      else {
          sortAsc = sort;
          sortDesc = (a, b) => sortAsc(a, b) * -1;
      }
      if (typeof sortKey === 'function') {
        sortFuncs[-1] = (a, b) => sortDesc(sortKey(a), sortKey(b));
        sortFuncs[1] = (a, b) => sortAsc(sortKey(a), sortKey(b));
      } else {
        let keyPaths = this.getKeyPaths(sortKey);
        if (keyPaths.length === 1) {
          const key = keyPaths[0];
          sortFuncs[-1] = (a, b) => sortDesc(a[key], b[key]);
          sortFuncs[1] = (a, b) => sortAsc(a[key], b[key]);
        } else {
          sortFuncs[-1] = (a, b) =>
            sortDesc(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths));
          sortFuncs[1] = (a, b) =>
            sortAsc(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths));
        }
      }
      this.sortKeysMap.set(sortKey, sortFuncs);
    }
    return toSort.sort(sortFuncs[sortOrder]);
  }

  getKeyPaths(keyPath) {
    if (Array.isArray(keyPath))
      return keyPath;

    keyPath = keyPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    keyPath = keyPath.replace(/^\./, '');           // strip a leading dot
    return keyPath.split('.');
  }

  /**
   * Retrieves the value in the object specified by the key path
   * @param object the object
   * @param keyPaths Array of property names parsed from the dotted key path.
   * @returns {*} the value
   */
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
    if (!this.hasFilter())
      return false;

    return this.filters.some(filter => !isNullOrEmpty(filter.value));
  }

  hasPagination() {
    return this.currentPage > 0 && this.pageSize > 0;
  }

  dataChanged() {
    if (this.dataObserver) {
      this.dataObserver.dispose();
    }

    this.dataObserver = this.bindingEngine.collectionObserver(this.data)
      .subscribe(() => this.applyPlugins(updateTypes.data));

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
      }
      else if (pendingKey !== undefined && key === pendingKey) {
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

  //Sort by the sort attribute with the given id, using the specified order.
  sortByAttributeId(id, order) {
    const attribute = this.sortAttributesById.get(id);
    if (attribute !== undefined) {
      attribute.setActive(order);
    }
    else {
      this.pendingSort = { id, order };
    }
  }

  //Sort by the sort attribute with the given key, using the specified order.
  sortByKey(key, order) {
    for (const attribute of this.sortAttributes) {
      if (attribute.key !== key)
        continue;

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

}
