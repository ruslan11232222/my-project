(function (App) {
  'use strict';
  const KEY = 'todo-items-v1';

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      console.error('Дані у сховищі пошкоджені, повертаємо порожній масив.');
      return [];
    }
  };

  const save = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
  };

  const clear = () => {
    localStorage.removeItem(KEY);
  };

  App.storage = { load, save, clear };
})((window.App = window.App || {}));
