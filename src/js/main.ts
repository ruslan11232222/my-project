import { loadStorage } from './storage';
import { renderList } from './render';
import { bindEvents } from './events';
import type { TodoItem } from './types';

document.addEventListener('DOMContentLoaded', () => {
  const items: TodoItem[] = loadStorage(); 
  renderList(items);
  bindEvents(items);
});