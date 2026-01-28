# Data Model: Cards.json to Excel Converter

**Feature**: 002-cards-to-excel  
**Date**: 2026-01-28

## Entities

### Card (Input)

Represents a solution catalog entry read from cards.json.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Display title of the solution |
| description | string | Yes | Brief description of the solution |
| categories | string[] | Yes | Solution domains (data, analytics, ai-application, ai-agent) |
| types | string[] | Yes | Asset types (code, design guidance, migration guidance, blog, public documentation, level up, onlinedemo, deployabledemo) |
| visibility | string | Yes | Access level (public, private) |
| link | string | Yes | URL to the solution resource (may be empty string) |
| hidden | boolean | No | Whether card is hidden from catalog display (defaults to false) |

**Source**: `src/data/cards.json`

### ExcelRow (Output)

Represents a single row in the exported Excel file.

| Column | Type | Source Transformation |
|--------|------|----------------------|
| title | string | Direct copy from Card.title |
| description | string | Direct copy from Card.description |
| categories | string | Card.categories.join(", ") |
| types | string | Card.types.join(", ") |
| visibility | string | Direct copy from Card.visibility |
| link | string | Direct copy from Card.link |
| hidden | string | Card.hidden === true ? "true" : "false" |

### ExcelWorkbook (Output)

The complete Excel file structure.

| Property | Value |
|----------|-------|
| Sheet Name | "Cards" |
| Row 1 | Header row with column names |
| Rows 2-N | Data rows (one per Card) |
| Format | .xlsx (Office Open XML) |

## State Transitions

```
[cards.json exists] → Read JSON → Parse to Card[] → Transform to ExcelRow[] → Write .xlsx → [Done]
                   ↓
            [File not found] → Error exit
                   ↓
            [Parse error] → Error exit
```

## Validation Rules

### Input Validation (cards.json)

| Rule | Behavior |
|------|----------|
| File must exist | Exit with error if missing |
| Must be valid JSON | Exit with error if parse fails |
| Must be array | Exit with error if not array |
| Cards should have required fields | Warn but continue (export empty cell for missing) |

### Output Validation

| Rule | Behavior |
|------|----------|
| Output directory must exist | Exit with error if missing |
| Must be writable | Exit with error if permission denied |

## Relationships

```
cards.json (1) ──contains──> (N) Card
Card (1) ──transforms to──> (1) ExcelRow  
ExcelRow (N) ──comprise──> (1) ExcelWorkbook
ExcelWorkbook (1) ──writes to──> (1) .xlsx file
```
