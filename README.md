## Solution Catalog (Vite)

A Vite-based static site for browsing the solution catalog.

### Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal.

### Production build
1. Run `npm run build`.
2. The static output is generated in [dist/](dist/).

### GitHub Pages deployment
The project is configured for GitHub Pages at `https://<user>.github.io/csatools/`:
- [vite.config.js](vite.config.js) uses `base: '/csatools/'`.

**Automatic deployment:** Push to `main` triggers the [deploy workflow](.github/workflows/deploy.yml) which builds and deploys to GitHub Pages.

**Setup:** In your repo settings, go to **Settings → Pages → Source** and select **GitHub Actions**.

### Data updates
Card data is stored in JSON:
- [src/data/cards.json](src/data/cards.json)

### Export cards to Excel
To export the card catalog to an Excel file:
```bash
npm run export-cards
```
This creates `cards-export.xlsx` in the current directory.

To specify a custom output path:
```bash
npm run export-cards -- ./path/to/output.xlsx
```

### Import cards from Excel
To import cards from an Excel file:
```bash
npm run import-cards -- ./path/to/input.xlsx
```

### Customization
Styles live in:
- [src/styles.css](src/styles.css)

Main entry:
- [src/main.js](src/main.js)
