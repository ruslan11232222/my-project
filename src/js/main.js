(function (App) {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const items = App.storage.load();
    App.render.list(items);
    App.events.bind(items);
  });
})(window.App);
