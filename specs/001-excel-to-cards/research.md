# Research: Excel to Cards.json Converter

**Feature**: 001-excel-to-cards | **Date**: 2026-01-28

## Research Tasks

This document resolves all technical unknowns identified during planning.

---

## 1. xlsx Library Usage for Reading Excel Files

**Context**: The project already uses `xlsx ^0.18.5` for exporting to Excel. Need to confirm reading patterns.

### Decision: Use `XLSX.readFile()` with `sheet_to_json()`

**Rationale**: 
- `XLSX.readFile(path)` reads the workbook from disk
- `XLSX.utils.sheet_to_json(sheet, { header: 1 })` extracts rows as arrays (matching export pattern)
- First row contains headers, subsequent rows are data
- This mirrors the inverse of `XLSX.utils.aoa_to_sheet()` used in the export script

**Alternatives Considered**:
- `sheet_to_json()` with object output: Auto-maps headers to keys, but less control over field normalization
- Streaming read: Overkill for 1000-row limit, adds complexity

**Code Pattern** (mirrors cards-to-excel.js):
```javascript
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile(inputPath);
const sheetName = workbook.SheetNames[0]; // First sheet only
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
```

---

## 2. Corrupted File Detection

**Context**: Spec requires failing immediately with clear error message for corrupted files.

### Decision: Wrap `XLSX.readFile()` in try-catch

**Rationale**:
- The xlsx library throws on corrupted/invalid files
- Error message from library is descriptive enough for user feedback
- Matches error handling pattern in cards-to-excel.js

**Error Types to Handle**:
- File not found: `existsSync()` check before read
- Not an Excel file: xlsx throws with format error
- Corrupted content: xlsx throws during parse

**Code Pattern**:
```javascript
let workbook;
try {
  workbook = XLSX.readFile(inputPath);
} catch (err) {
  console.error(`Error: Failed to read Excel file - ${err.message}`);
  process.exit(1);
}
```

---

## 3. Duplicate Detection Strategy

**Context**: Spec requires detecting duplicate titles, keeping first occurrence, warning about skipped duplicates.

### Decision: Use Set for O(1) title lookup

**Rationale**:
- Simple, efficient approach for up to 1000 rows
- Normalize title (trim + lowercase) before comparison
- Track skipped duplicates for summary warning

**Code Pattern**:
```javascript
const seenTitles = new Set();
const duplicates = [];

for (const row of dataRows) {
  const normalizedTitle = row.title.trim().toLowerCase();
  if (seenTitles.has(normalizedTitle)) {
    duplicates.push({ row: rowIndex, title: row.title });
    continue; // Skip duplicate
  }
  seenTitles.add(normalizedTitle);
  cards.push(row);
}

if (duplicates.length > 0) {
  console.warn(`Warning: Skipped ${duplicates.length} duplicate title(s)`);
}
```

---

## 4. Column Header Mapping

**Context**: Spec mentions case-insensitive matching for column headers.

### Decision: Normalize headers to lowercase, map to schema fields

**Rationale**:
- Excel sources may have inconsistent casing ("Title" vs "TITLE" vs "title")
- Map all recognized variants to canonical lowercase field names
- Unknown columns are silently ignored per spec

**Expected Headers** (case-insensitive):
| Excel Header | Card Field |
|--------------|------------|
| title | title |
| description | description |
| categories | categories (split by comma) |
| types | types (split by comma) |
| visibility | visibility |
| link | link |

---

## 5. Validation Constants

**Context**: Need to validate against allowed values from constitution.

### Decision: Define constants matching constitution

**Allowed Categories**: `data`, `analytics`, `ai-application`, `ai-agent`
**Allowed Types**: `code`, `design guidance`, `migration guidance`, `blog`, `public documentation`, `level up`, `onlinedemo`, `deployabledemo`
**Allowed Visibility**: `public`, `private`

**Note**: These match the values defined in `src/utils/constants.js` and the constitution. Validation is warning-only, does not block output.

---

## 6. Row Limit Enforcement

**Context**: Spec requires 1000 rows hard maximum.

### Decision: Count data rows (excluding header), fail if > 1000

**Rationale**:
- Check count before processing to fail fast
- Data rows = total rows - 1 (header)
- Clear error message with actual count

**Code Pattern**:
```javascript
const MAX_ROWS = 1000;
const dataRowCount = rows.length - 1; // Exclude header

if (dataRowCount > MAX_ROWS) {
  console.error(`Error: File exceeds ${MAX_ROWS} row limit (found ${dataRowCount} data rows)`);
  process.exit(1);
}
```

---

## Summary

| Unknown | Resolution |
|---------|------------|
| xlsx read pattern | `XLSX.readFile()` + `sheet_to_json()` with header:1 |
| Corrupted file handling | try-catch around readFile, exit(1) with message |
| Duplicate detection | Set-based title tracking, warn and skip |
| Header mapping | Case-insensitive normalization to lowercase |
| Validation values | Constants from constitution/spec |
| Row limit | Count check before processing, fail > 1000 |

All technical unknowns resolved. Ready for Phase 1 design.
