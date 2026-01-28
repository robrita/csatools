# Research: Cards.json to Excel Converter

**Feature**: 002-cards-to-excel  
**Date**: 2026-01-28  
**Purpose**: Resolve technical decisions before implementation

## Research Areas

### 1. Excel Library Selection

**Decision**: Use `xlsx` (SheetJS Community Edition)

**Rationale**:
- Most widely adopted Excel library for Node.js (30M+ weekly npm downloads)
- Supports .xlsx format (Office Open XML) natively
- Zero dependencies in core functionality
- Works in both Node.js and browser environments
- Comprehensive documentation and community support
- MIT licensed

**Alternatives Considered**:

| Library | Rejected Because |
|---------|------------------|
| exceljs | Larger bundle, more complex API for simple use case |
| write-excel-file | Less mature, smaller community |
| csv-stringify | Spec requires .xlsx format, not CSV |
| node-xlsx | Wrapper around xlsx, adds unnecessary abstraction |

### 2. Column Mapping Strategy

**Decision**: Use explicit column order matching card schema

**Column Order** (matches existing cards.json structure):
1. title
2. description  
3. categories (array → comma-separated string)
4. types (array → comma-separated string)
5. visibility
6. link

**Rationale**: Consistent ordering enables round-trip compatibility with 001-excel-to-cards feature.

### 3. Array to String Conversion

**Decision**: Join arrays with ", " (comma-space)

**Examples**:
- `["data", "analytics"]` → `"data, analytics"`
- `["code", "design guidance"]` → `"code, design guidance"`

**Rationale**: 
- Human-readable in Excel
- Consistent with existing data patterns
- Easy to split back during import (001-excel-to-cards)

### 4. Default Output Path

**Decision**: `./cards-export.xlsx` in current working directory

**Rationale**:
- Predictable location
- Doesn't overwrite source data
- Clearly named as an export file
- No timestamp in default name (cleaner for version control)

### 5. Error Handling Strategy

**Decision**: Fail fast with clear error messages

| Scenario | Behavior |
|----------|----------|
| cards.json not found | Exit with error: "Error: cards.json not found at {path}" |
| Invalid JSON | Exit with error: "Error: Failed to parse cards.json - {JSON error}" |
| Output directory missing | Exit with error: "Error: Output directory does not exist: {path}" |
| Write permission denied | Exit with error: "Error: Cannot write to {path}" |

### 6. Script Invocation Pattern

**Decision**: npm script with optional argument

```bash
# Default usage
npm run export-cards

# With custom output path  
npm run export-cards -- ./exports/catalog.xlsx
```

**package.json script**:
```json
{
  "scripts": {
    "export-cards": "node scripts/cards-to-excel.js"
  }
}
```

**Rationale**: Consistent with existing npm script patterns in project.

### 7. Round-Trip Compatibility

**Decision**: Ensure exported Excel can be re-imported via 001-excel-to-cards

**Requirements for compatibility**:
- Header row uses exact field names: title, description, categories, types, visibility, link
- Arrays converted to comma-separated strings (import splits on comma)
- Empty strings preserved (not converted to null)
- All rows preserve order

## Dependencies

### New devDependency

```json
{
  "devDependencies": {
    "xlsx": "^0.18.5"
  }
}
```

**Justification**: Required for .xlsx generation. Constitution allows package additions with "explicit justification" - this is the only viable option for proper Excel format support.

## Summary

All research items resolved. No NEEDS CLARIFICATION items remain. Ready for Phase 1 design.
