import './styles.css';
import cardsData from './data/cards.json';
import { App } from './components/App.js';
import { renderCards } from './components/CardGrid.js';
import { setupFilters } from './components/Filters.js';

const app = document.getElementById('app');
app.innerHTML = App();

const gallery = document.getElementById('gallery');
const visibleCardsData = cardsData.filter(card => !card.hidden);
const cards = renderCards(visibleCardsData, gallery);

setupFilters({
  cards
});
