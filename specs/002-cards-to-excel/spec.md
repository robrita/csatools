# Feature Specification: Cards.json to Excel Converter

**Feature Branch**: `002-cards-to-excel`  
**Created**: 2026-01-28  
**Status**: Draft  
**Input**: User description: "add js script for converting cards.json data to excel file"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export Cards Data to Excel (Priority: P1)

A catalog maintainer wants to export the current cards.json data to an Excel spreadsheet for editing, sharing with stakeholders, or backup purposes. They run a simple command to generate an Excel file from the existing catalog data.

**Why this priority**: This is the core functionality. Without the export capability, no other features matter.

**Independent Test**: Can be fully tested by running the script against the existing cards.json and verifying the output Excel file contains all card entries with correct column mapping.

**Acceptance Scenarios**:

1. **Given** a valid cards.json file exists in src/data/, **When** the user runs the export script, **Then** an Excel file (.xlsx) is generated containing all card data.

2. **Given** a card has multiple categories (array), **When** exported to Excel, **Then** the categories appear as comma-separated values in a single cell.

3. **Given** a card has multiple types (array), **When** exported to Excel, **Then** the types appear as comma-separated values in a single cell.

4. **Given** the export completes, **When** the user opens the Excel file, **Then** the first row contains column headers matching card field names (title, description, categories, types, visibility, link).

---

### User Story 2 - Specify Output Location (Priority: P2)

The catalog maintainer wants to export the Excel file to a specific location or with a custom filename for organizational purposes.

**Why this priority**: Provides flexibility for different workflows without changing core functionality.

**Independent Test**: Can be tested by running the script with an output path argument and verifying the file is created at the specified location.

**Acceptance Scenarios**:

1. **Given** the user provides an output path argument, **When** the script runs, **Then** the Excel file is created at the specified path.

2. **Given** no output path is provided, **When** the script runs, **Then** the Excel file is created with a default name in the current directory.

3. **Given** the specified output directory does not exist, **When** the script runs, **Then** an error message is displayed indicating the directory must exist.

---

### Edge Cases

- What happens when cards.json is empty (empty array)? → Generate Excel with header row only.
- What happens when cards.json doesn't exist? → Error with clear message about missing file.
- What happens when cards.json contains invalid JSON? → Error with message about parsing failure.
- What happens when a card is missing optional fields? → Export empty cell for missing fields.
- What happens when description contains special characters or newlines? → Preserve content as-is in Excel cell.
- What happens when link field is empty string? → Export empty cell.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Script MUST read cards.json from src/data/cards.json by default
- **FR-002**: Script MUST output valid Excel files (.xlsx format)
- **FR-003**: Script MUST create a header row with columns: title, description, categories, types, visibility, link
- **FR-004**: Script MUST convert categories array to comma-separated string in Excel cell
- **FR-005**: Script MUST convert types array to comma-separated string in Excel cell
- **FR-006**: Script MUST preserve visibility field as-is (public/private string)
- **FR-007**: Script MUST be executable via Node.js command line
- **FR-008**: Script MUST display progress message and output file path to console
- **FR-009**: Script MUST accept optional output path argument

### Key Entities

- **Card**: A solution catalog entry with title, description, categories (array), types (array), visibility (string), and link (URL string)
- **Cards.json**: JSON array of card objects in src/data/ directory
- **Excel Output**: Spreadsheet file with header row and data rows corresponding to card entries

## Assumptions

- Node.js environment with npm available
- cards.json follows the existing schema structure
- Output Excel format is .xlsx (modern Excel format)
- Default output filename includes timestamp or is descriptive (e.g., cards-export.xlsx)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can export cards.json to Excel in under 10 seconds for files with up to 500 cards
- **SC-002**: 100% of cards in JSON are represented as rows in the exported Excel file
- **SC-003**: Exported Excel file can be re-imported using the 001-excel-to-cards feature to produce identical cards.json
- **SC-004**: Users can open the exported file in Microsoft Excel, Google Sheets, or LibreOffice Calc without errors
