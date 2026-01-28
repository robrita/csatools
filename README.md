## Solution Catalog (Vite)

This workspace includes a Vite-based static site under solution-catalog.

### Project location
- [solution-catalog/](solution-catalog)

### Local development
1. Install dependencies:
	- In [solution-catalog/package.json](solution-catalog/package.json), run `npm install`.
2. Start the dev server:
	- Run `npm run dev`.
3. Open the local URL shown in the terminal.

### Production build
1. Run `npm run build`.
2. The static output is generated in [solution-catalog/dist/](solution-catalog/dist/).

### GitHub Pages deployment
#### Option A: User/Org Pages (root)
If publishing to `https://<user>.github.io/`, keep the current base path:
- [solution-catalog/vite.config.js](solution-catalog/vite.config.js) uses `base: './'` for relative paths.

#### Option B: Project Pages (subpath)
If publishing to `https://<user>.github.io/<repo>/`, set `base` to `'/<repo>/'` in:
- [solution-catalog/vite.config.js](solution-catalog/vite.config.js)

Then build and deploy the `dist` folder:
1. Run `npm run build`.
2. Push the contents of [solution-catalog/dist/](solution-catalog/dist/) to the `gh-pages` branch, or configure GitHub Actions to deploy the folder.

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

### Customization
Styles live in:
- [solution-catalog/src/styles.css](solution-catalog/src/styles.css)

Main entry:
- [solution-catalog/src/main.js](solution-catalog/src/main.js)
