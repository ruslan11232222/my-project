
export interface TodoItem {
  readonly id: string;
  title: string;
  done: boolean;
  createdAt?: number;
}

export interface Post {
  readonly id: number;
  userId?: number;
  title: string;
  body: string;
}

export interface Author {
  readonly id: number;
  name: string;
  username?: string;
  email?: string;
}

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export type CreateTodoDto = Omit<TodoItem, 'id' | 'done'>; 
export type UpdatePostDto = Partial<Omit<Post, 'id'>>;     
export type PostPreview = Readonly<Pick<Post, 'id' | 'title'>>; 

export function isPost(data: unknown): data is Post {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const record = data as Record<string, unknown>;
  return (
    typeof record.id === 'number' &&
    typeof record.title === 'string' &&
    typeof record.body === 'string'
  );
}

export function isPostArray(data: unknown): data is Post[] {
  return Array.isArray(data) && data.every(isPost);
}