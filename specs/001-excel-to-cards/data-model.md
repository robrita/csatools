# Data Model: Excel to Cards.json Converter

**Feature**: 001-excel-to-cards | **Date**: 2026-01-28

## Overview

This document defines the data structures for converting Excel spreadsheet data to the cards.json format used by the Solution Catalog.

---

## Entities

### Card (Output)

The target JSON structure for each catalog entry. Matches existing `src/data/cards.json` schema.

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| title | string | Yes | Non-empty | Display name of the solution |
| description | string | Yes | Allow empty | Brief description of the solution |
| categories | string[] | Yes | Values in allowed list | Category tags for filtering |
| types | string[] | Yes | Values in allowed list | Content type tags for filtering |
| visibility | string | Yes | "public" or "private" | Access level indicator |
| link | string | No | URL or empty string | Resource URL (empty for unreleased) |

**Example**:
```json
{
  "title": "GPT-RAG",
  "description": "Enterprise-grade GPT assistant framework...",
  "categories": ["ai-application"],
  "types": ["code"],
  "visibility": "public",
  "link": "https://github.com/Azure/gpt-rag"
}
```

---

### ExcelRow (Input)

Raw row data extracted from Excel spreadsheet.

| Column | Maps To | Transformation |
|--------|---------|----------------|
| title | title | Trim whitespace |
| description | description | Trim whitespace |
| categories | categories | Split by comma, trim each, lowercase |
| types | types | Split by comma, trim each, lowercase |
| visibility | visibility | Trim, lowercase |
| link | link | Trim whitespace |

**Header Matching**: Case-insensitive (e.g., "Title", "TITLE", "title" all map to `title`)

---

### ValidationWarning

Structure for tracking validation issues during conversion.

| Field | Type | Description |
|-------|------|-------------|
| row | number | 1-based row number in Excel (data row, not header) |
| field | string | Field name with issue |
| value | string | The problematic value |
| message | string | Human-readable warning description |

**Example**:
```javascript
{
  row: 5,
  field: "categories",
  value: "unknown-category",
  message: "Invalid category 'unknown-category'. Allowed: data, analytics, ai-application, ai-agent"
}
```

---

### ConversionResult

Summary structure returned after processing.

| Field | Type | Description |
|-------|------|-------------|
| cards | Card[] | Successfully converted cards |
| warnings | ValidationWarning[] | All validation warnings |
| duplicatesSkipped | number | Count of duplicate titles skipped |
| totalRows | number | Total data rows in source |

---

## Validation Rules

### Required Fields

- **title**: Must be non-empty after trimming

### Allowed Values

**Categories** (warn if not in list):
- `data`
- `analytics`
- `ai-application`
- `ai-agent`

**Types** (warn if not in list):
- `code`
- `design guidance`
- `migration guidance`
- `blog`
- `public documentation`
- `level up`
- `onlinedemo`
- `deployabledemo`

**Visibility** (warn if not in list):
- `public`
- `private`

### Normalization

| Field | Normalization |
|-------|---------------|
| All text fields | Trim leading/trailing whitespace |
| categories | Lowercase each value |
| types | Lowercase each value |
| visibility | Lowercase |
| title (for duplicate check) | Lowercase comparison only (original case preserved in output) |

---

## State Transitions

```
ExcelFile → [Parse] → ExcelRow[] → [Validate & Transform] → Card[] → [Write] → cards.json
                ↓                            ↓
           ParseError                  ValidationWarning[]
```

**Parse Success Path**:
1. Read Excel file → Extract rows from first sheet
2. Map headers to field names (case-insensitive)
3. For each data row:
   - Transform to Card structure
   - Validate fields (collect warnings)
   - Check for duplicate title (skip if duplicate)
4. Write all valid cards to JSON
5. Display summary with warnings

**Parse Failure Path**:
- Corrupted file → Error message → Exit(1)
- Missing required columns → Error message → Exit(1)
- Exceeds 1000 rows → Error message → Exit(1)
