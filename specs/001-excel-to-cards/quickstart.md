# Quickstart: Excel to Cards.json Converter

**Feature**: 001-excel-to-cards | **Date**: 2026-01-28

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)

## Quick Usage

### 1. Prepare your Excel file

Create an Excel file (.xlsx) with these columns in the first row:

| title | description | categories | types | visibility | link |
|-------|-------------|------------|-------|------------|------|
| My Solution | Description here | data, analytics | code, blog | public | https://... |

### 2. Run the converter

```bash
npm run import-cards -- ./path/to/catalog.xlsx
```

### 3. Verify output

Check `src/data/cards.json` for the converted data.

---

## Common Workflows

### Update catalog from Excel source of truth

```bash
# 1. Export current catalog to Excel (for backup/editing)
npm run export-cards -- ./catalog-backup.xlsx

# 2. Edit the Excel file with new/updated entries

# 3. Import back to cards.json
npm run import-cards -- ./catalog-backup.xlsx
```

### Validate Excel data before publishing

```bash
npm run import-cards -- ./catalog.xlsx
# Review any warnings in console output
# Fix issues in Excel file
# Re-run until no warnings
```

---

## Excel File Format

### Required Structure

- **Format**: .xlsx (Office Open XML)
- **Sheet**: Uses first sheet only
- **Row 1**: Header row with column names (case-insensitive)
- **Rows 2+**: Data rows (maximum 1000)

### Column Reference

| Column | Required | Example Values |
|--------|----------|----------------|
| title | Yes | "GPT-RAG" |
| description | Yes | "Enterprise GPT assistant..." |
| categories | Yes | "ai-application" or "data, analytics" |
| types | Yes | "code" or "code, design guidance" |
| visibility | Yes | "public" or "private" |
| link | No | "https://github.com/..." or empty |

### Allowed Values

**Categories**: `data`, `analytics`, `ai-application`, `ai-agent`

**Types**: `code`, `design guidance`, `migration guidance`, `blog`, `public documentation`, `level up`, `onlinedemo`, `deployabledemo`

**Visibility**: `public`, `private`

---

## Troubleshooting

### "Missing required columns" error

Ensure your Excel file has all six required column headers in the first row. Column names are case-insensitive.

### Warnings about invalid values

The converter warns but still generates output. Fix warnings in your Excel source for data consistency:
- Check spelling of category/type values
- Ensure visibility is exactly "public" or "private"

### "File exceeds 1000 row limit" error

Split your data into multiple files, each with ≤1000 rows.

### Duplicate title warnings

Each card should have a unique title. The converter keeps the first occurrence and skips duplicates.

---

## File Locations

| File | Purpose |
|------|---------|
| `scripts/excel-to-cards.js` | Converter script |
| `src/data/cards.json` | Default output location |
| `package.json` | Contains `import-cards` npm script |

## Related Commands

| Command | Purpose |
|---------|---------|
| `npm run import-cards` | Excel → JSON (this feature) |
| `npm run export-cards` | JSON → Excel (reverse) |
| `npm run dev` | Start dev server to preview catalog |
