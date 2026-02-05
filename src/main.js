import './styles/main.css';


const FAVORITES_KEY = 'favorites';

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
function renderFavorites() {
  const favoritesContainer = document.querySelector('.favorites .cards');
  const favoritesState = document.querySelector('.favorites .state');

  const favorites = getFavorites();
  favoritesContainer.innerHTML = '';

  if (favorites.length === 0) {
    favoritesState.style.display = 'block';
    return;
  }

  favoritesState.style.display = 'none';

  favorites.forEach(book => {
    favoritesContainer.innerHTML += `
      <div class="card">
        <div class="card__cover">
          ${book.cover_i
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}.jpg">`
            : 'No cover'}
        </div>
        <div class="card__title">${book.title}</div>
        <div class="card__author">${book.author}</div>
        <div class="card__year">${book.year || '-'}</div>
        <button class="card__button card__button--remove" data-key="${book.key}">
          Remove
        </button>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('#theme-toggle');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
  const searchInput = document.querySelector('.search__input');
  const searchButton = document.querySelector('.search__button');
  const resultsContainer = document.querySelector('.results .cards');
  const favoritesContainer = document.querySelector('.favorites .cards');

  favoritesContainer.addEventListener('click', (e) => {
	  if (!e.target.classList.contains('card__button--remove')) return;

	  const key = e.target.dataset.key;

	  let favorites = getFavorites();
	  favorites = favorites.filter(book => book.key !== key);

	  saveFavorites(favorites);
	  renderFavorites();
  });

  resultsContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('card__button')) return;

  const card = e.target.closest('.card');
  const key = e.target.dataset.key;

  const title = card.querySelector('.card__title').textContent;
  const author = card.querySelector('.card__author').textContent;
  const year = card.querySelector('.card__year').textContent;
  const img = card.querySelector('img');
  const cover_i = img ? img.src.match(/\/b\/id\/(\d+)/)?.[1] : null;

  let favorites = getFavorites();

  if (favorites.some(book => book.key === key)) return;

  favorites.push({ key, title, author, year, cover_i });
  saveFavorites(favorites);
  renderFavorites();
  });
  const stateMessage = document.querySelector('.results .state');

  function showSkeletons(container, count = 6) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.innerHTML += `
        <div class="card skeleton">
          <div class="skeleton-cover"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
          <div class="skeleton-button"></div>
        </div>
      `;
    }
  }

  function renderBooks(container, books) {
  const favorites = getFavorites();
  container.innerHTML = '';
  books.forEach(book => {
    const isFavorite = favorites.some(fav => fav.key === book.key);
    container.innerHTML += `
      <div class="card">
        <div class="card__cover">
          ${
            book.cover_i
              ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg">`
              : `<div class="no-cover">No cover</div>`
          }
        </div>
        <div class="card__title">${book.title}</div>
        <div class="card__author">${book.author_name ? book.author_name.join(', ') : 'Unknown'}</div>
        <div class="card__year">${book.first_publish_year || '-'}</div>
        <button class="card__button" data-key="${book.key}" ${isFavorite ? 'disabled' : ''}>
          ${isFavorite ? 'In Favorites' : 'Add to Favorites'}
        </button>
      </div>
    `;
  });
}

  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    console.log('CLICK, QUERY =', query);

    if (!query) {
      stateMessage.textContent = 'Enter a query';
      stateMessage.className = 'state state--info';
      resultsContainer.innerHTML = '';
      return;
    }

    showSkeletons(resultsContainer);
    stateMessage.textContent = 'Loading...';
    stateMessage.className = 'state state--loading';
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      console.log('FETCH DATA:', data);

      if (!data.docs || data.docs.length === 0) {
        resultsContainer.innerHTML = '';
        stateMessage.textContent = 'Nothing found';
        stateMessage.className = 'state state--error';
        return;
      }

      renderBooks(resultsContainer, data.docs.slice(0, 12));
	  stateMessage.textContent = '';
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = '';
      stateMessage.textContent = 'Network error';
      stateMessage.className = 'state state--error';
    }
  });
  renderFavorites();
});


