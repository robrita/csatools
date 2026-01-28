# CLI Contract: excel-to-cards

**Feature**: 001-excel-to-cards
**Date**: 2026-01-28

## Command

```bash
node scripts/excel-to-cards.js <input-path> [output-path]
```

Or via npm script:

```bash
npm run import-cards -- <input-path> [output-path]
```

## Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| input-path | Yes | N/A | Path to the Excel (.xlsx) file to convert |
| output-path | No | `src/data/cards.json` | Path where the JSON file will be written |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success - cards.json created (may include warnings) |
| 1 | Error - File not found, parse error, missing columns, or row limit exceeded |

## Standard Output

### Success (no warnings)

```
Reading Excel file from ./catalog.xlsx...
Found 31 data rows
Converting to cards.json format...
✓ Converted 31 cards to src/data/cards.json
```

### Success (with warnings)

```
Reading Excel file from ./catalog.xlsx...
Found 35 data rows
Converting to cards.json format...

Warnings:
  Row 5: Empty title field
  Row 12: Invalid category 'unknown'. Allowed: data, analytics, ai-application, ai-agent
  Row 18: Invalid type 'video'. Allowed: code, design guidance, migration guidance, blog, public documentation, level up, onlinedemo, deployabledemo
  Row 22: Invalid visibility 'internal'. Allowed: public, private
  Row 30: Duplicate title 'GPT-RAG' (skipped)

Summary: 34 cards converted, 5 warnings, 1 duplicate skipped
✓ Converted 34 cards to src/data/cards.json
```

### Error Examples

**File not found:**
```
Error: Excel file not found at ./missing.xlsx
```

**Corrupted file:**
```
Error: Failed to read Excel file - File is not a valid xlsx file
```

**Missing required columns:**
```
Error: Missing required columns: title, categories
Required columns: title, description, categories, types, visibility, link
```

**Row limit exceeded:**
```
Error: File exceeds 1000 row limit (found 1523 data rows)
```

**Empty file:**
```
Warning: Excel file contains no data rows
✓ Converted 0 cards to src/data/cards.json
```

## Input Requirements

### Excel File Structure

| Property | Value |
|----------|-------|
| Format | .xlsx (Office Open XML) |
| Sheet Used | First sheet only |
| Row 1 | Header row with column names |
| Rows 2-N | Data rows (max 1000) |

### Required Columns (case-insensitive)

| Column Name | Required | Description |
|-------------|----------|-------------|
| title | Yes | Card title (must be non-empty) |
| description | Yes | Card description (may be empty) |
| categories | Yes | Comma-separated category values |
| types | Yes | Comma-separated type values |
| visibility | Yes | "public" or "private" |
| link | Yes | URL or empty string |

### Multi-value Fields

Categories and types may contain multiple values separated by commas:

| Excel Cell | JSON Output |
|------------|-------------|
| `data, analytics` | `["data", "analytics"]` |
| `code, design guidance` | `["code", "design guidance"]` |
| `ai-application` | `["ai-application"]` |

## Output Format

### cards.json Structure

```json
[
  {
    "title": "Solution Name",
    "description": "Solution description",
    "categories": ["data", "analytics"],
    "types": ["code", "design guidance"],
    "visibility": "public",
    "link": "https://github.com/..."
  }
]
```

## Usage Examples

### Import from Excel (default output)

```bash
npm run import-cards -- ./catalog.xlsx
# Output: src/data/cards.json
```

### Import to specific path

```bash
npm run import-cards -- ./catalog.xlsx ./backup/cards-new.json
# Output: ./backup/cards-new.json
```

### Direct node invocation

```bash
node scripts/excel-to-cards.js ./catalog.xlsx
# Output: src/data/cards.json
```

## Validation Behavior

Validation issues generate **warnings** but do not block conversion:

| Issue | Behavior |
|-------|----------|
| Empty title | Warning logged, row included with empty title |
| Invalid category | Warning logged, value included as-is |
| Invalid type | Warning logged, value included as-is |
| Invalid visibility | Warning logged, value included as-is |
| Duplicate title | Warning logged, subsequent rows skipped |
| Extra columns | Silently ignored |
| Empty cells | Converted to empty string or empty array |

## Comparison with cards-to-excel

| Aspect | excel-to-cards (this) | cards-to-excel |
|--------|----------------------|----------------|
| Direction | Excel → JSON | JSON → Excel |
| Input | .xlsx file | src/data/cards.json |
| Output | src/data/cards.json | .xlsx file |
| Validation | Warns on invalid values | N/A (trusts JSON) |
| npm script | `import-cards` | `export-cards` |
