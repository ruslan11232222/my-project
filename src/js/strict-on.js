(function () {
  'use strict';
  console.log('--- СТРОГИЙ РЕЖИМ ---');
  const check = (label, fn) => {
    try {
      console.log(label, '→', fn());
    } catch (error) {
      console.log(label, '→', `${error.name}: ${error.message}`);
    }
  };

  check('Неоголошена змінна', () => {
    undeclaredOn = 1;
    return undeclaredOn;
  });
  check('this у функції', function () {
    return String(this);
  });

  const frozen = Object.freeze({ a: 1 });
  check("Заморожений об'єкт", () => {
    frozen.a = 2;
    return frozen.a;
  });
  check('Видалення властивості', () => {
    delete Object.prototype;
  });
  check('Інструкція with', () => new Function('"use strict"; with (Math) return PI;')());
  check('Однакові параметри', () => new Function('a', 'a', '"use strict"; return a;')(1, 2));
})();
