import '../styles/api.scss';
import { debounce, storage } from './utils.js';
import { fetchWithRetry, request } from './api.js';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const CACHE_KEY = 'posts_cache';

const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const retryBtn = document.getElementById('retryBtn');
const parallelTestBtn = document.getElementById('parallelTestBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const successState = document.getElementById('successState');
const postsList = document.getElementById('postsList');
const emptyMessage = document.getElementById('emptyMessage');
const errorMessage = document.getElementById('errorMessage');
const authorProfile = document.getElementById('authorProfile');

let currentPage = 1;
const limit = 10;
let currentQuery = '';
let controller = null;

function setUIState(state, message = '') {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  successState.classList.add('hidden');

  if (state === 'loading') {
    loadingState.classList.remove('hidden');
    searchInput.disabled = true;
  } else if (state === 'error') {
    errorState.classList.remove('hidden');
    errorMessage.textContent = message;
    searchInput.disabled = false;
  } else if (state === 'success') {
    successState.classList.remove('hidden');
    searchInput.disabled = false;
  }
}

function renderPosts(posts, append = false) {
  if (!append) postsList.innerHTML = '';
  if (posts.length === 0 && !append) {
    emptyMessage.classList.remove('hidden');
    loadMoreBtn.classList.add('hidden');
    return;
  }

  emptyMessage.classList.add('hidden');
  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.className = 'post-card';
    const title = document.createElement('h3');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.textContent = post.body;
    li.append(title, body);
    fragment.append(li);
  });

  postsList.append(fragment);

  if (posts.length < limit) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

async function loadPosts(query = '', page = 1) {
  controller?.abort();
  controller = new AbortController();
  const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]);

  if (page === 1 && query === '') {
    const cached = storage.load(CACHE_KEY);
    if (cached) {
      renderPosts(cached);
      setUIState('success');
    }
  }

  if (page === 1 && !storage.load(CACHE_KEY)) setUIState('loading');

  try {
    const url = `${BASE_URL}/posts?_page=${page}&_limit=${limit}${query ? `&q=${encodeURIComponent(query)}` : ''}`;

    const posts = await fetchWithRetry(url, { signal }, 3);

    if (page === 1 && query === '') {
      storage.save(CACHE_KEY, posts);
    }

    renderPosts(posts, page > 1);
    setUIState('success');
  } catch (error) {
    if (error.name === 'AbortError') return;

    // Виправлена логіка msg для ESLint
    const msg =
      error.name === 'TimeoutError'
        ? 'Сервер не відповів за 5 секунд (Тайм-аут).'
        : error.message || 'Помилка мережі.';

    setUIState('error', msg);
  }
}

const handleSearch = debounce((e) => {
  currentQuery = e.target.value.trim();
  currentPage = 1;
  loadPosts(currentQuery, currentPage);
}, 500);

async function testParallelLoad() {
  parallelTestBtn.disabled = true;
  authorProfile.textContent = 'Завантаження профілю...';
  authorProfile.classList.remove('hidden');

  try {
    const startTime = performance.now();
    const [user, posts, albums] = await Promise.all([
      request(`${BASE_URL}/users/1`),
      request(`${BASE_URL}/posts?userId=1`),
      request(`${BASE_URL}/albums?userId=1`),
    ]);
    const endTime = performance.now();

    // Виправлена синтаксична помилка
    console.log(`Паралельне завантаження зайняло: ${(endTime - startTime).toFixed(2)} мс`);

    authorProfile.innerHTML = '';
    const name = document.createElement('h3');
    name.textContent = `Автор: ${user.name}`;
    const stats = document.createElement('p');
    stats.textContent = `Написав ${posts.length} публікацій та створив ${albums.length} альбомів.`;
    authorProfile.append(name, stats);
  } catch (error) {
    console.error(error); // Додано для уникнення помилки 'error is never used'
    authorProfile.textContent = 'Помилка завантаження профілю.';
  } finally {
    parallelTestBtn.disabled = false;
  }
}

searchInput.addEventListener('input', handleSearch);
loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadPosts(currentQuery, currentPage);
});
retryBtn.addEventListener('click', () => loadPosts(currentQuery, currentPage));
parallelTestBtn.addEventListener('click', testParallelLoad);
document.addEventListener('DOMContentLoaded', () => loadPosts());
