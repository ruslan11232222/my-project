(function () {
  'use strict';
  const customMap = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], i, arr));
    }
    return result;
  };

  const arr = [1, 2, 3];
  const multiply = (x) => x * 2;

  const res1 = arr.map(multiply);
  const res2 = customMap(arr, multiply);

  console.assert(JSON.stringify(res1) === JSON.stringify(res2), 'Custom map failed');
  console.assert(JSON.stringify(customMap([], multiply)) === '[]', 'Failed on empty array');
  console.assert(JSON.stringify(arr) === '[1,2,3]', 'Array mutated');
  console.log('Custom Map: OK');
})();
