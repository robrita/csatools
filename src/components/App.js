import { Filters } from './Filters.js';

export function App() {
  return `
    <header class="header">
      <h1 class="title">ASEAN CSU CAIP Solutions Catalog</h1>
      <p class="subtitle">Curated, reusable assets across Data, Analytics &amp; AI</p>
    </header>

    <div class="layout">
      ${Filters()}
      <section class="content">
        <div class="topbar">
          <input id="searchInput" class="search-input" type="search" placeholder="Search by title…" aria-label="Search by title">
          <span id="itemCount" class="item-count"></span>
        </div>

        <main class="grid" id="gallery"></main>

        <p id="noResults" class="no-results hidden" role="status" aria-live="polite">
          No results match your filters.
        </p>
      </section>
    </div>
  `;
}
