export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) {
  let timerId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

interface StoragePayload<T> {
  timestamp: number;
  data: T;
}

export const storage = {
  save<T>(key: string, data: T): void {
    const payload: StoragePayload<T> = { timestamp: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(payload));
  },

  load<T>(key: string, maxAgeMinutes: number = 5): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      
      const payload = JSON.parse(raw) as StoragePayload<T>;
      
      const isExpired = Date.now() - payload.timestamp > maxAgeMinutes * 60 * 1000;
      return isExpired ? null : payload.data;
    } catch {
      return null;
    }
  },
};