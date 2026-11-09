(function () {
  'use strict';
  const customFlat = (arr, depth = 1) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i]) && depth > 0) {
        result.push(...customFlat(arr[i], depth - 1));
      } else {
        result.push(arr[i]);
      }
    }
    return result;
  };

  const arr = [1, [2, [3, [4]]]];
  console.assert(
    JSON.stringify(arr.flat(1)) === JSON.stringify(customFlat(arr, 1)),
    'Flat depth 1 failed'
  );
  console.assert(
    JSON.stringify(arr.flat(Infinity)) === JSON.stringify(customFlat(arr, Infinity)),
    'Flat Infinity failed'
  );
  console.log('Custom Flat: OK');
})();
