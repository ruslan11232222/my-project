import type { Post, Author, TodoItem } from './types';

export interface Identifiable {
  id: number;
}

export class Repository<T extends Identifiable> {
  private items = new Map<number, T>();
  
  add(item: T): void { 
    this.items.set(item.id, item); 
  }
  
  get(id: number): T | undefined { 
    return this.items.get(id); 
  }
  
  remove(id: number): boolean { 
    return this.items.delete(id); 
  }
  
  list(): readonly T[] { 
    return [...this.items.values()]; 
  }
  
  update(id: number, patch: Partial<Omit<T, "id">>): T | undefined {
    const current = this.items.get(id);
    if (!current) return undefined; 
    const next: T = { ...current, ...patch };
    this.items.set(id, next);
    return next;
  }
}

export const postsRepo = new Repository<Post>();
export const authorsRepo = new Repository<Author>();
const STORAGE_KEY = 'todo-list-ts';

export const loadStorage = (): TodoItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
  
    return data ? (JSON.parse(data) as TodoItem[]) : [];
  } catch {
    return [];
  }
};

export const saveStorage = (items: TodoItem[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};