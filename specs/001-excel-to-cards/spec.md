# Feature Specification: Excel to Cards.json Converter

**Feature Branch**: `001-excel-to-cards`  
**Created**: 2026-01-28  
**Status**: Draft  
**Input**: User description: "add js script for converting excel file to cards.json data"

## Clarifications

### Session 2026-01-28

- Q: What should the script do when the Excel file contains duplicate card entries (rows with identical titles)? → A: Keep first occurrence only, warn about skipped duplicates
- Q: What should happen when the Excel file is corrupted or cannot be parsed? → A: Fail immediately with a clear error message (no output file created)
- Q: What is the maximum expected Excel file size (number of rows) the script must handle without degradation? → A: 1000 rows hard limit
- Q: What should happen when the Excel file exceeds 1000 rows? → A: Fail with error: "File exceeds 1000 row limit" (no output)
- Q: What should happen when the output file (cards.json) already exists? → A: Overwrite silently (standard regeneration behavior)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Convert Excel to Cards Data (Priority: P1)

A catalog maintainer has updated solution entries in an Excel spreadsheet (the source of truth for card data). They want to run a simple command to regenerate the cards.json file, ensuring the catalog reflects the latest spreadsheet content.

**Why this priority**: This is the core functionality. Without the conversion capability, no other features matter.

**Independent Test**: Can be fully tested by providing a sample Excel file with valid card data and verifying the output matches expected JSON structure.

**Acceptance Scenarios**:

1. **Given** an Excel file with columns matching the card schema (title, description, categories, types, visibility, link), **When** the user runs the conversion script, **Then** a valid cards.json file is generated with all rows converted to card objects.

2. **Given** an Excel file with multiple rows of card data, **When** the conversion completes, **Then** the output JSON array contains one object per row with correct field mappings.

3. **Given** a card row with multiple categories (comma-separated in Excel), **When** converted, **Then** the categories field contains an array of individual category values.

4. **Given** a card row with multiple types (comma-separated in Excel), **When** converted, **Then** the types field contains an array of individual type values.

---

### User Story 2 - Validate Excel Data During Conversion (Priority: P2)

The catalog maintainer wants to be notified of data quality issues during conversion so they can fix problems in the Excel file before the catalog is published.

**Why this priority**: Data validation prevents broken catalog entries and ensures consistency.

**Independent Test**: Can be tested by providing an Excel file with intentional errors and verifying appropriate warnings are displayed.

**Acceptance Scenarios**:

1. **Given** an Excel row missing the required "title" field, **When** converted, **Then** a warning is displayed identifying the row number.

2. **Given** an Excel row with an invalid category value (not in allowed list), **When** converted, **Then** a warning is displayed with the invalid value and allowed options.

3. **Given** an Excel row with an invalid type value, **When** converted, **Then** a warning is displayed with the invalid value and allowed options.

4. **Given** validation warnings exist, **When** conversion completes, **Then** a summary shows total warnings and the output file is still generated (warnings don't block output).

---

### Edge Cases

- What happens when the Excel file is empty (no data rows)? → Generate empty JSON array `[]` with a warning.
- What happens when the Excel file has extra columns not in the schema? → Ignore extra columns silently.
- What happens when the Excel file is missing expected columns? → Error with clear message about which columns are required.
- What happens when cell values have leading/trailing whitespace? → Trim whitespace automatically.
- What happens when categories or types contain inconsistent casing? → Normalize to lowercase.
- What happens when the link field is empty? → Allow empty string (per existing data pattern for unreleased items).
- What happens when duplicate titles exist? → Keep first occurrence only, warn about skipped duplicates.
- What happens when the Excel file is corrupted or unreadable? → Fail immediately with a clear error message (no output file created).
- What happens when the Excel file exceeds 1000 rows? → Fail with error: "File exceeds 1000 row limit" (no output).
- What happens when the output file (cards.json) already exists? → Overwrite silently (standard regeneration behavior).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Script MUST read Excel files (.xlsx format) as input
- **FR-002**: Script MUST output valid JSON matching the existing cards.json schema
- **FR-003**: Script MUST map Excel columns to card fields: title, description, categories, types, visibility, link
- **FR-004**: Script MUST convert comma-separated values in categories column to JSON arrays
- **FR-005**: Script MUST convert comma-separated values in types column to JSON arrays
- **FR-006**: Script MUST preserve the visibility field as a string value (public/private)
- **FR-007**: Script MUST be executable via Node.js command line
- **FR-008**: Script MUST display progress and any validation warnings to console
- **FR-009**: Script MUST write output to src/data/cards.json by default

### Data Validation Requirements

- **FR-010**: Script MUST warn when title field is empty
- **FR-011**: Script MUST warn when categories contain values not in: data, analytics, ai-application, ai-agent
- **FR-012**: Script MUST warn when types contain values not in: code, design guidance, migration guidance, blog, public documentation, level up, onlinedemo, deployabledemo
- **FR-013**: Script MUST warn when visibility is not "public" or "private"

### Key Entities

- **Card**: A solution catalog entry with title, description, categories (array), types (array), visibility (string), and link (URL string)
- **Excel Source**: Spreadsheet file with one header row and data rows, columns corresponding to card fields
- **Conversion Output**: JSON array of card objects written to cards.json

## Assumptions

- Excel file uses first sheet for data
- First row contains column headers
- Column headers match card field names (case-insensitive matching acceptable)
- Comma is the delimiter for multi-value fields (categories, types)
- Script runs in Node.js environment with npm available

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can convert an Excel file to cards.json in under 30 seconds for files with up to 1000 rows (hard maximum supported)
- **SC-002**: 100% of valid Excel rows are converted to corresponding JSON objects
- **SC-003**: Generated cards.json validates against existing catalog schema and displays correctly in the catalog UI
- **SC-004**: Users can identify and fix data issues using validation warnings before publishing
