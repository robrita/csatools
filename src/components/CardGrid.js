import { createCard } from './Card.js';

export function renderCards(cardsData, gallery) {
  gallery.innerHTML = '';
  const elements = cardsData.map(card => createCard(card));
  elements.forEach(cardEl => gallery.appendChild(cardEl));
  return elements;
}
