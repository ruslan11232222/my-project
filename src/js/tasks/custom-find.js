(function () {
    "use strict";
    const customFind = (arr, fn) => {
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) return arr[i];
        }
        return undefined;
    };

    const arr = [{id: 1}, {id: 2}, {id: 3}];
    console.assert(arr.find(x => x.id === 2) === customFind(arr, x => x.id === 2), "Find matching failed");
    console.assert(customFind(arr, x => x.id === 99) === undefined, "Find non-existent failed");
    console.log("Custom Find: OK");
})();