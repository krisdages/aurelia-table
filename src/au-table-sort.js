import {inject, bindable} from 'aurelia-framework';
import {AureliaTableCustomAttribute} from './au-table';

@inject(AureliaTableCustomAttribute, Element)
export class AutSortCustomAttribute {

  @bindable id;
  @bindable key;
  @bindable custom;
  @bindable type;
  @bindable default;
  defaultChanged() {
    if (this.isAttached) {
      this.auTable.setSortAttributeDirty(this);
    }
  }

  get defaultOrder() {
    if (!this.default)
      return undefined;

    return this.default === 'desc' ? -1 : 1;
  }

  isAttached = false;

  order = 0;
  orderClasses = ['aut-desc', 'aut-sortable', 'aut-asc'];

  ignoreEvent = false;

  constructor(auTable, element) {
    this.auTable = auTable;
    this.element = element;

    this.rowSelectedListener = () => {
      this.handleHeaderClicked();
    };

    this.sortChangedListener = () => {
      this.handleSortChanged();
    };
  }

  handleSortChanged() {
    if (!this.ignoreEvent) {
      this.order = 0;
      this.setClass();
    } else {
      this.ignoreEvent = false;
    }
  }



  attached() {
    // == is intended
    if (this.key == null && this.custom == null) {
      throw new Error('Must provide a key or a custom sort function.');
    }

    this.element.style.cursor = 'pointer';
    this.element.classList.add('aut-sort');

    this.element.addEventListener('click', this.rowSelectedListener);
    this.auTable.registerSortAttribute(this);

    this.setClass();
    this.isAttached = true;
  }

  detached() {
    this.element.removeEventListener('click', this.rowSelectedListener);
    this.auTable.unregisterSortAttribute(this);
    this.isAttached = false;
  }

  doSort() {
    this.ignoreEvent = true;
    //Babel is defaulting properties to null instead of undefined... why?
    this.auTable.sortChanged(this.key, this.type || undefined, this.custom || undefined, this.order);
  }

  setClass() {
    this.orderClasses.forEach(next => this.element.classList.remove(next));
    this.element.classList.add(this.orderClasses[this.order + 1]);
  }

  handleHeaderClicked() {
    this.order = this.order === 0 || this.order === -1 ? this.order + 1 : -1;
    this.setClass();
    this.doSort();
  }

  setActive(order, triggerSortChanged = true) {
    this.order = order;
    this.setClass();
    if (triggerSortChanged) {
      this.doSort();
    }
  }
}
