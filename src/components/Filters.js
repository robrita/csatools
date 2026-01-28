import { filterIcons } from '../utils/icons.js';
import { normalize, splitList } from '../utils/formatters.js';

export function Filters() {
  const groups = [
    {
      title: 'Asset Category',
      name: 'category',
      options: [
        { value: 'data', label: 'Data', icon: filterIcons.category.data },
        { value: 'analytics', label: 'Analytics', icon: filterIcons.category.analytics },
        { value: 'ai-application', label: 'AI Application', icon: filterIcons.category['ai-application'] },
        { value: 'ai-agent', label: 'AI Agent', icon: filterIcons.category['ai-agent'] }
      ]
    },
    {
      title: 'Asset Type',
      name: 'type',
      options: [
        { value: 'code', label: 'Code', icon: filterIcons.type.code },
        { value: 'design guidance', label: 'Design Guidance', icon: filterIcons.type['design guidance'] },
        { value: 'migration guidance', label: 'Migration Guidance', icon: filterIcons.type['migration guidance'] },
        { value: 'public documentation', label: 'Public Documentation', icon: filterIcons.type['public documentation'] },
        { value: 'blog', label: 'Blog', icon: filterIcons.type.blog },
        { value: 'level up', label: 'Level Up', icon: filterIcons.type['level up'] },
        { value: 'onlinedemo', label: 'Demo (Online)', icon: filterIcons.type.onlinedemo },
        { value: 'deployabledemo', label: 'Demo (Deployable)', icon: filterIcons.type.deployabledemo }
      ]
    },
    {
      title: 'Asset Visibility',
      name: 'visibility',
      options: [
        { value: 'public', label: 'Public (External)', icon: filterIcons.visibility.public },
        { value: 'private', label: 'Private (Internal MS)', icon: filterIcons.visibility.private }
      ]
    }
  ];

  const groupsHtml = groups.map(group => {
    const optionsHtml = group.options
      .map(option => {
        return `
          <label>
            <input type="checkbox" name="${group.name}" value="${option.value}">
            ${option.icon}
            ${option.label}
          </label>
        `;
      })
      .join('');

    return `
      <section class="filter-group">
        <h3 class="filter-title">${group.title}</h3>
        <div class="checklist">${optionsHtml}</div>
      </section>
    `;
  }).join('');

  return `
    <aside class="sidebar">
      <h2>Filters</h2>
      ${groupsHtml}
      <div class="filters-actions">
        <button id="resetFilters" class="link-reset" type="button">Clear filters</button>
      </div>
    </aside>
  `;
}

export function setupFilters({ cards }) {
  const searchInput = document.getElementById('searchInput');
  const resetBtn = document.getElementById('resetFilters');
  const noResultsEl = document.getElementById('noResults');
  const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));

  const getChecked = (name) =>
    Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
      .map(cb => normalize(cb.value));

  const parseTypes = (el) => splitList(el.dataset.types ?? el.dataset.type ?? '');
  const parseCategories = (el) => splitList(el.dataset.category ?? '');
  const parseVisibility = (el) => normalize(el.dataset.visibility ?? '');

  function applyFilters() {
    const term = normalize(searchInput.value);
    const selCats = getChecked('category');
    const selTypes = getChecked('type');
    const selVisibility = getChecked('visibility');

    let shown = 0;

    cards.forEach(card => {
      const title = normalize(card.querySelector('h3')?.textContent);
      const cardCats = parseCategories(card);
      const cardTypes = parseTypes(card);
      const cardVis = parseVisibility(card);

      const matchText = !term || title.includes(term);
      const matchCat = selCats.length === 0 || cardCats.some(c => selCats.includes(c));
      const matchType = selTypes.length === 0 || cardTypes.some(t => selTypes.includes(t));
      const matchVis = selVisibility.length === 0 || selVisibility.includes(cardVis);

      const show = matchText && matchCat && matchType && matchVis;
      card.classList.toggle('hidden', !show);
      if (show) shown++;
    });

    noResultsEl.classList.toggle('hidden', shown !== 0);
    document.getElementById('itemCount').textContent = `Showing ${shown} of ${cards.length} items`;
  }

  searchInput.addEventListener('input', applyFilters);
  allCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  resetBtn?.addEventListener('click', () => {
    searchInput.value = '';
    allCheckboxes.forEach(cb => cb.checked = false);
    applyFilters();
  });

  applyFilters();
}
