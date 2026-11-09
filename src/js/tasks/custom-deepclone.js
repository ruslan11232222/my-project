(function () {
  'use strict';
  const deepClone = (obj, hash = new WeakMap()) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);

    let clone;
    if (obj instanceof Date) clone = new Date(obj);
    else if (obj instanceof Map)
      clone = new Map(Array.from(obj, ([k, v]) => [k, deepClone(v, hash)]));
    else if (obj instanceof Set) clone = new Set(Array.from(obj, (v) => deepClone(v, hash)));
    else clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));

    hash.set(obj, clone);

    if (clone instanceof Map || clone instanceof Set || clone instanceof Date) return clone;

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key], hash);
      }
    }
    return clone;
  };

  const source = {
    date: new Date(),
    map: new Map([['key', 'value']]),
    nested: { a: 1 },
  };
  source.cyclic = source;

  const clone = deepClone(source);

  console.assert(clone !== source, 'References are the same!');
  console.assert(clone.nested !== source.nested, 'Nested references are the same!');
  console.assert(clone.map.get('key') === 'value', 'Map not cloned properly');
  console.assert(clone.cyclic === clone, 'Cyclic reference failed');
  console.log('Custom DeepClone: OK');
})();
