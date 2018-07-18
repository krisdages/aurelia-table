This is a fork of Hector Romero's aurelia-table plugin.
It contains some optimizations of sorting/filtering and supports specifying
column datatype with a corresponding registry of default sort functions.
By default, columns with type Number, Date, and Boolean will use a numeric sort.

There is no separate documentation for this fork (sorry).

Please visit the [project page](http://tochoromero.github.com/aurelia-table) for the documentation and examples.

## Features
Aurelia Table is very easy to use, and you have complete control over the look and feel. You can make your table look exactly the way you want using plain html and css.
Out of the box you will get:
 - Row Filtering
 - Column Sorting
 - Client side pagination
 - Row Selection
 
For a complete list of features and examples please visit the [project page](http://tochoromero.github.com/aurelia-table).

### Release Notes
##### Fork by Kris Dages
#### 0.5.0-prerelease
- Allow sort functions for a column type to be specified as a tuple of `[sortAsc, sortDesc]`
instead of a single asc sort function.
- Added numericDemoteNull tuple to sortFunctions export.<br>(always sorts null/undefined to the bottom for both asc/desc sort)

#### 0.4.0
* Expose bindable property displayDataUnpaged for accessing the sorted/filtered data without paging.

#### 0.3.0
* Added bindable delegate onFilterChanged

#### 0.2.0
* Optimized sorting and filtering. Added binding for sort datatype to aut-sort attribute.

##### End Fork by Kris Dages
----

#### 0.1.13
* Disable pagination if Page size is 0. Fixes #32
* Improve support for webpack 2.0. Fixes #38
