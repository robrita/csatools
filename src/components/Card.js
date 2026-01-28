import { typeIcons, visibilityIcons } from '../utils/icons.js';
import { typeColorMap } from '../utils/constants.js';
import { formatType } from '../utils/formatters.js';

export function createCard(card) {
  const article = document.createElement('article');
  article.className = 'card';
  article.dataset.category = card.categories.join(', ');
  article.dataset.types = card.types.join(', ');
  article.dataset.visibility = card.visibility;

  const tagsHTML = card.types
    .map(type => {
      const icon = typeIcons[type.toLowerCase()] || '';
      const colorClass = typeColorMap[type.toLowerCase()] || 'code';
      return `<span class="tag ${colorClass}"><span class="tag-icon">${icon}</span>${formatType(type)}</span>`;
    })
    .join('');

  const categoriesHTML = card.categories
    .map(cat => `<span class="category">${formatType(cat)}</span>`)
    .join('');

  const visibilityIcon = visibilityIcons[card.visibility] || visibilityIcons.private;

  article.innerHTML = `
    <h3>${card.title}</h3>
    <p class="desc">${card.description}</p>
    <div class="tags">${tagsHTML}</div>
    <div class="meta">
      ${categoriesHTML}
      <span class="visibility-badge" title="${card.visibility}">${visibilityIcon}</span>
      <a class="find-more" href="${card.link}" target="_blank">Know More</a>
    </div>
  `;

  return article;
}
