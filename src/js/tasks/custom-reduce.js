(function () {
  'use strict';
  const customReduce = (arr, fn, initialValue) => {
    let accumulator = initialValue !== undefined ? initialValue : arr[0];
    let startIndex = initialValue !== undefined ? 0 : 1;

    for (let i = startIndex; i < arr.length; i++) {
      accumulator = fn(accumulator, arr[i], i, arr);
    }
    return accumulator;
  };

  const arr = [1, 2, 3, 4];
  const sum = (acc, val) => acc + val;

  console.assert(
    arr.reduce(sum, 0) === customReduce(arr, sum, 0),
    'Reduce with initial value failed'
  );
  console.assert(arr.reduce(sum) === customReduce(arr, sum), 'Reduce without initial value failed');
  console.assert(JSON.stringify(arr) === '[1,2,3,4]', 'Array mutated');
  console.log('Custom Reduce: OK');
})();
