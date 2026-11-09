export async function request(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body) {
        headers.set('Content-Type', 'application/json');
    }
    const fetchOptions = { ...options, headers };
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json();
}
export async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await request(url, options);
        } catch (error) {
            if (error.name === 'AbortError') throw error; 
            if (i === retries - 1) throw error;
            const delay = 1000 * Math.pow(2, i);
            console.warn(`Збій запиту. Спроба ${i + 2} через ${delay}мс...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}