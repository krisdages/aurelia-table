import {sortFunctions} from '../../src/au-table';

describe('numericDemoteNull', () => {

  it('sorts ascending with null and undefined at the end', () => {
    const arr = [undefined, 5, null, 6];
    const nullAndUndefined = [undefined, null];
    arr.sort(sortFunctions.numericDemoteNull[0]);
    expect(arr[0]).toEqual(5);
    expect(arr[1]).toEqual(6);
    expect(nullAndUndefined).toContain(arr[2]);
    expect(nullAndUndefined).toContain(arr[3]);
  });

  it('sorts descending with null and undefined at the end', () => {
    const arr = [undefined, 5, null, 6];
    const nullAndUndefined = [undefined, null];
    arr.sort(sortFunctions.numericDemoteNull[1]);
    expect(arr[0]).toEqual(6);
    expect(arr[1]).toEqual(5);
    expect(nullAndUndefined).toContain(arr[2]);
    expect(nullAndUndefined).toContain(arr[3]);
  });

});
