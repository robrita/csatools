# CLI Contract: cards-to-excel

**Feature**: 002-cards-to-excel  
**Date**: 2026-01-28

## Command

```bash
node scripts/cards-to-excel.js [output-path]
```

Or via npm script:

```bash
npm run export-cards [-- output-path]
```

## Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| output-path | No | `./cards-export.xlsx` | Path where the Excel file will be written |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success - Excel file created |
| 1 | Error - File not found, parse error, or write error |

## Standard Output

### Success

```
Reading cards from src/data/cards.json...
Found 31 cards
Writing Excel file...
✓ Exported to ./cards-export.xlsx
```

### Error Examples

```
Error: cards.json not found at src/data/cards.json
```

```
Error: Failed to parse cards.json - Unexpected token at position 42
```

```
Error: Output directory does not exist: ./exports/
```

## Input Requirements

### cards.json

- Location: `src/data/cards.json` (relative to project root)
- Format: JSON array of card objects
- Schema: See data-model.md

## Output Format

### Excel File Structure

| Property | Value |
|----------|-------|
| Format | .xlsx (Office Open XML) |
| Sheet Name | "Cards" |
| Row 1 | Header: title, description, categories, types, visibility, link |
| Rows 2-N | Card data (one row per card) |

### Column Details

| Column | Width | Content |
|--------|-------|---------|
| A (title) | Auto | Card title |
| B (description) | Auto | Card description |
| C (categories) | Auto | Comma-separated categories |
| D (types) | Auto | Comma-separated types |
| E (visibility) | Auto | "public" or "private" |
| F (link) | Auto | URL string |

## Usage Examples

### Export with default path

```bash
npm run export-cards
# Output: ./cards-export.xlsx
```

### Export to specific path

```bash
npm run export-cards -- ./backups/catalog-2026-01-28.xlsx
# Output: ./backups/catalog-2026-01-28.xlsx
```

### Direct node invocation

```bash
node scripts/cards-to-excel.js ./exports/cards.xlsx
# Output: ./exports/cards.xlsx
```
