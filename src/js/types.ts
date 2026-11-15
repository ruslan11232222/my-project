export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
}

export interface Post {
  userId?: number;
  id: number;
  title: string;
  body: string;
}

export interface Author {
  id: number;
  name: string;
  username?: string;
  email?: string;
}

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