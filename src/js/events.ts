import { saveStorage, clearStorage } from './storage';
import { renderList } from './render';
import type { TodoItem } from './types';

const debounce = (fn: () => void, delay: number) => {
  let timerId: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(), delay);
  };
};

export const bindEvents = (items: TodoItem[]) => {
  const form = document.getElementById('todo-form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Форму не знайдено');
  
  const listContainer = document.getElementById('todo-list');
  if (!(listContainer instanceof HTMLUListElement)) throw new Error('Список не знайдено');
  
  const searchInput = document.getElementById('search');
  if (!(searchInput instanceof HTMLInputElement)) throw new Error('Поле пошуку не знайдено');
  
  const clearBtn = document.getElementById('clear-storage');
  if (!(clearBtn instanceof HTMLButtonElement)) throw new Error('Кнопку очищення не знайдено');
  
  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    const input = form.elements.namedItem('title');
    if (!(input instanceof HTMLInputElement)) throw new Error('Поле title не знайдено у формі');
    
    const errorMsg = form.querySelector('.error-msg');
    if (!(errorMsg instanceof HTMLElement)) throw new Error('Блок помилки не знайдено');
    
    const title = input.value.trim();
    if (title.length < 3) {
      input.setCustomValidity('Назва має містити щонайменше 3 символи.');
      input.setAttribute('aria-invalid', 'true');
      errorMsg.textContent = input.validationMessage;
      input.focus();
      return;
    }
    
    input.setCustomValidity('');
    input.removeAttribute('aria-invalid');
    errorMsg.textContent = '';
    
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title: title,
      done: false,
    };
    
    items.push(newItem);
    saveStorage(items);
    renderList(items);
    form.reset();
  });

  listContainer.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const li = target.closest('.todo-item');
    if (!(li instanceof HTMLElement) || !listContainer.contains(li)) return;
    
    const id = li.dataset.id;
    if (!id) return;
    
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    const currentItem = items[index];
    if (!currentItem) return;

    if (target.matches('.delete-btn')) {
      items.splice(index, 1);
    } else if (target.matches('.toggle-btn')) {
      currentItem.done = !currentItem.done;
    } else if (target.matches('.edit-btn')) {
      const newTitle = prompt('Редагувати справу:', currentItem.title);
      if (newTitle !== null && newTitle.trim().length >= 3) {
        currentItem.title = newTitle.trim();
      } else if (newTitle !== null) {
        alert('Назва має містити щонайменше 3 символи.');
      }
    }

    saveStorage(items);
    applyFilter();
  });

  const applyFilter = () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = items.filter((item) => item.title.toLowerCase().includes(query));
    renderList(filtered);
  };
  
  searchInput.addEventListener('input', debounce(applyFilter, 300));
  
  clearBtn.addEventListener('click', () => {
    if (confirm('Видалити всі справи?')) {
      items.length = 0;
      clearStorage();
      renderList(items);
    }
  });
};