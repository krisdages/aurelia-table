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

@inject(BindingEngine)
export class AureliaTableCustomAttribute {

  static collator = new Intl.Collator(undefined, { numeric: true });

  @bindable data;
  @bindable({defaultBindingMode: bindingMode.twoWay}) displayData;

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
  sortChangedListeners = [];
  sortTypeMap = new Map([
    [Number, sortFunctions.numeric],
    [Boolean, sortFunctions.numeric],
    [String, sortFunctions.ascii],
    [Date, sortFunctions.numeric],
    [Intl.Collator, sortFunctions.collator],
    ['auto', sortFunctions.auto]
  ]);
  sortKeysMap = new Map();
  beforePagination = [];

  dataObserver;
  filterObservers = [];

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
  }

  bind() {
    if (Array.isArray(this.data)) {
      this.dataObserver = this.bindingEngine.collectionObserver(this.data).subscribe(() => this.applyPlugins());
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
    this.applyPlugins();
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
    if (this.hasPagination()) {
      this.currentPage = 1;
    }
    this.applyPlugins();
    if (typeof this.onFilterChanged === "function") {
      this.onFilterChanged();
    }
  }

  currentPageChanged() {
    this.applyPlugins();
  }

  pageSizeChanged() {
    this.applyPlugins();
  }

  /**
   * Copies the data into the display data
   */
  getDataCopy() {
    return [].concat(this.data);
  }

  /**
   * Applies all the plugins to the display data
   */
  applyPlugins() {
    if (!this.isAttached || !this.data) {
      return;
    }

    let localData = this.getDataCopy();

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


  }

  doFilter(toFilter) {
    const hasFilterValue = this.filters.some(filter => !isNullOrEmpty(filter.value));
    if (!hasFilterValue) {
      //Skip processing and just return the original array.
      return toFilter;
    }

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
      if (typeof sortKey === 'function') {
        sortFuncs[-1] = (a, b) => sort(sortKey(a), sortKey(b)) * -1;
        sortFuncs[1] = (a, b) => sort(sortKey(a), sortKey(b));
      } else {
        let keyPaths = this.getKeyPaths(sortKey);
        if (keyPaths.length === 1) {
          const key = keyPaths[0];
          sortFuncs[-1] = (a, b) => sort(a[key], b[key]) * -1;
          sortFuncs[1] = (a, b) => sort(a[key], b[key]);
        } else {
          sortFuncs[-1] = (a, b) =>
            sort(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths)) * -1;
          sortFuncs[1] = (a, b) =>
            sort(this.getPropertyValue(a, keyPaths), this.getPropertyValue(b, keyPaths));
        }
      }
      this.sortKeysMap.set(sortKey, sortFuncs);
    }
    return toSort.sort(sortFuncs[sortOrder]);
  }

  getKeyPaths(keyPath) {
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

  hasPagination() {
    return this.currentPage > 0 && this.pageSize > 0;
  }

  dataChanged() {
    if (this.dataObserver) {
      this.dataObserver.dispose();
    }

    this.dataObserver = this.bindingEngine.collectionObserver(this.data)
      .subscribe(() => this.applyPlugins());

    this.applyPlugins();
  }

  sortChanged(key, type, custom, order) {
    this.sortKey = key;
    this.sortType = type;
    this.customSort = custom;
    this.sortOrder = order;
    this.applyPlugins();
    this.emitSortChanged();
  }

  addSortChangedListener(callback) {
    this.sortChangedListeners.push(callback);
  }

  removeSortChangedListener(callback) {
    this.removeListener(callback, this.sortChangedListeners);
  }

  emitSortChanged() {
    for (let listener of this.sortChangedListeners) {
      listener();
    }
  }

  removeListener(callback, listeners) {
    let index = listeners.indexOf(callback);

    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  revealItem(item) {
    if (!this.hasPagination()) {
      return true;
    }

    let index = this.beforePagination.indexOf(item);

    if (index === -1) {
      return false;
    }

    this.currentPage = Math.ceil((index + 1) / this.pageSize);

    return true;
  }

}
