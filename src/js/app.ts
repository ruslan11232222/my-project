import '../styles/api.scss';
import { debounce, storage } from './utils';
import { fetchWithRetry, request } from './api';
import type { Post } from './types';
import { isPostArray } from './types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const CACHE_KEY = 'posts_cache';

const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;
const retryBtn = document.getElementById('retryBtn') as HTMLButtonElement;
const parallelTestBtn = document.getElementById('parallelTestBtn') as HTMLButtonElement;
const loadingState = document.getElementById('loadingState') as HTMLElement;
const errorState = document.getElementById('errorState') as HTMLElement;
const successState = document.getElementById('successState') as HTMLElement;
const postsList = document.getElementById('postsList') as HTMLUListElement;
const emptyMessage = document.getElementById('emptyMessage') as HTMLElement;
const errorMessage = document.getElementById('errorMessage') as HTMLElement;
const authorProfile = document.getElementById('authorProfile') as HTMLElement;

let currentPage = 1;
const limit = 10;
let currentQuery = '';
let controller: AbortController | null = null;

type UIState = 'loading' | 'error' | 'success';

function setUIState(state: UIState, message: string = '') {
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

function renderPosts(posts: Post[], append: boolean = false) {
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

async function loadPosts(query: string = '', page: number = 1) {
  controller?.abort();
  controller = new AbortController();
  const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]);

  if (page === 1 && query === '') {
    const cached = storage.load<Post[]>(CACHE_KEY);
    if (cached) {
      renderPosts(cached);
      setUIState('success');
    }
  }

  if (page === 1 && !storage.load(CACHE_KEY)) setUIState('loading');

  try {
    const url = `${BASE_URL}/posts?_page=${page}&_limit=${limit}${query ? `&q=${encodeURIComponent(query)}` : ''}`;

    const posts = await fetchWithRetry<Post[]>(url, isPostArray, { signal }, 3);

    if (page === 1 && query === '') {
      storage.save(CACHE_KEY, posts);
    }

    renderPosts(posts, page > 1);
    setUIState('success');
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;

    const msg = error instanceof Error
      ? (error.name === 'TimeoutError' ? 'Сервер не відповів за 5 секунд (Тайм-аут).' : error.message)
      : 'Помилка мережі.';

    setUIState('error', msg);
  }
}

const handleSearch = debounce((e: Event) => {
  const target = e.target as HTMLInputElement;
  currentQuery = target.value.trim();
  currentPage = 1;
  void loadPosts(currentQuery, currentPage); // Додано void
}, 500);

interface UserInfo { name: string }
const isUser = (data: unknown): data is UserInfo => typeof data === 'object' && data !== null && 'name' in data;
const isAlbumArray = (data: unknown): data is unknown[] => Array.isArray(data);

async function testParallelLoad() {
  parallelTestBtn.disabled = true;
  authorProfile.textContent = 'Завантаження профілю...';
  authorProfile.classList.remove('hidden');

  try {
    const startTime = performance.now();
    const [user, posts, albums] = await Promise.all([
      request<UserInfo>(`${BASE_URL}/users/1`, isUser),
      request<Post[]>(`${BASE_URL}/posts?userId=1`, isPostArray),
      request<unknown[]>(`${BASE_URL}/albums?userId=1`, isAlbumArray),
    ]);
    const endTime = performance.now();

    console.log(`Паралельне завантаження зайняло: ${(endTime - startTime).toFixed(2)} мс`);

    authorProfile.innerHTML = '';
    const name = document.createElement('h3');
    name.textContent = `Автор: ${user.name}`;
    const stats = document.createElement('p');
    stats.textContent = `Написав ${posts.length} публікацій та створив ${albums.length} альбомів.`;
    authorProfile.append(name, stats);
  } catch (error) {
    console.error(error); 
    authorProfile.textContent = 'Помилка завантаження профілю.';
  } finally {
    parallelTestBtn.disabled = false;
  }
}

searchInput.addEventListener('input', handleSearch);

loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  void loadPosts(currentQuery, currentPage); // Додано void
});

retryBtn.addEventListener('click', () => { 
  void loadPosts(currentQuery, currentPage); 
});

parallelTestBtn.addEventListener('click', () => { 
  void testParallelLoad(); 
});

document.addEventListener('DOMContentLoaded', () => { 
  void loadPosts(); 
});