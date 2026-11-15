// src/js/render.ts
import type { TodoItem } from './types';

const listElement = document.getElementById('todo-list');
const totalCount = document.getElementById('total-count');
const doneCount = document.getElementById('done-count');
const pendingCount = document.getElementById('pending-count');

const createNode = (item: TodoItem): HTMLLIElement => {
  const li = document.createElement('li');
  li.className = `todo-item ${item.done ? 'done' : ''}`;
  li.dataset.id = item.id;

  const textSpan = document.createElement('span');
  textSpan.className = 'item-text';
  textSpan.textContent = item.title;

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'item-actions';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-btn';
  toggleBtn.textContent = item.done ? 'Відновити' : 'Виконати';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Редагувати';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn danger';
  deleteBtn.textContent = '×';

  actionsDiv.append(toggleBtn, editBtn, deleteBtn);
  li.append(textSpan, actionsDiv);
  return li;
};
export const renderList = (items: TodoItem[]) => {
  if (!(listElement instanceof HTMLUListElement)) return; // Перевірка на null

  listElement.innerHTML = '';
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.append(createNode(item));
  });

  listElement.append(fragment);
  updateCounters(items);
};

const updateCounters = (items: TodoItem[]) => {
  if (!totalCount || !doneCount || !pendingCount) return;

  const total = items.length;
  const done = items.reduce((acc, curr) => acc + (curr.done ? 1 : 0), 0);
  totalCount.textContent = String(total);
  doneCount.textContent = String(done);
  pendingCount.textContent = String(total - done);
};