export async function request<T>(
  url: string,
  validator: (data: unknown) => data is T,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }
  const fetchOptions: RequestInit = { ...options, headers };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const data: unknown = await response.json();
  if (validator(data)) {
    return data;
  } else {
    throw new Error("Неочікувана структура відповіді від сервера");
  }
}
export async function fetchWithRetry<T>(
  url: string,
  validator: (data: unknown) => data is T,
  options: RequestInit = {},
  retries: number = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await request<T>(url, validator, options);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') throw error;
      if (i === retries - 1) throw error;
      const delay = 1000 * Math.pow(2, i);
      console.warn(`Збій запиту. Спроба ${i + 2} через ${delay}мс...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Невідома помилка під час виконання fetchWithRetry");
}