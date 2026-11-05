(function () {
    "use strict";
    const customFilter = (arr, fn) => {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) result.push(arr[i]);
        }
        return result;
    };

    const arr = [1, 2, 3, 4, 5];
    const isEven = (x) => x % 2 === 0;

    console.assert(JSON.stringify(arr.filter(isEven)) === JSON.stringify(customFilter(arr, isEven)), "Custom filter failed");
    console.assert(JSON.stringify(customFilter(arr, x => x > 10)) === "[]", "Failed when none match");
    console.assert(JSON.stringify(arr) === "[1,2,3,4,5]", "Array mutated");
    console.log("Custom Filter: OK");
})();