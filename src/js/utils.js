export function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}
export const storage = {
  save(key, data) {
    const payload = { timestamp: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(payload));
  },
  load(key, maxAgeMinutes = 5) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      const isExpired = Date.now() - payload.timestamp > maxAgeMinutes * 60 * 1000;
      return isExpired ? null : payload.data;
    } catch {
      return null;
    }
  },
};
