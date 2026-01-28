# Tasks: Excel to Cards.json Converter

**Feature**: 001-excel-to-cards  
**Input**: Design documents from `/specs/001-excel-to-cards/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Manual testing only (no test framework in project). Verification via `npm run import-cards` with test Excel files.

**Format**: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]**: User Story 1 - Convert Excel to Cards Data (P1)
- **[US2]**: User Story 2 - Validate Excel Data During Conversion (P2)

---

## Phase 1: Setup

**Purpose**: Add npm script and create script file skeleton

- [X] T001 Add `import-cards` script to package.json
- [X] T002 Create script skeleton with shebang and imports in scripts/excel-to-cards.js

**Checkpoint**: `npm run import-cards` runs without error (shows usage/help or exits cleanly)

---

## Phase 2: Foundational (Core Script Structure)

**Purpose**: CLI argument parsing and file I/O - required before any conversion logic

- [X] T003 Implement CLI argument parsing (input-path required, output-path optional) in scripts/excel-to-cards.js
- [X] T004 Implement input file validation (exists, .xlsx extension) in scripts/excel-to-cards.js
- [X] T005 Implement Excel file reading with xlsx library in scripts/excel-to-cards.js
- [X] T006 Implement row limit check (fail if >1000 data rows) in scripts/excel-to-cards.js
- [X] T007 Implement JSON file writing with overwrite behavior in scripts/excel-to-cards.js

**Checkpoint**: Script can read Excel file and write empty JSON array. Fails appropriately on missing file, corrupted file, or >1000 rows.

---

## Phase 3: User Story 1 - Convert Excel to Cards Data (Priority: P1) 🎯 MVP

**Goal**: Convert valid Excel rows to cards.json format with correct field mapping and array handling.

**Independent Test**: Run `npm run import-cards -- ./test-valid.xlsx` with a sample Excel file containing 3-5 valid cards. Verify `src/data/cards.json` contains correctly structured JSON.

### Implementation for User Story 1

- [X] T008 [US1] Implement header row extraction and case-insensitive column mapping in scripts/excel-to-cards.js
- [X] T009 [US1] Implement missing required columns check (fail with error listing missing columns) in scripts/excel-to-cards.js
- [X] T010 [US1] Implement row-to-card transformation with whitespace trimming in scripts/excel-to-cards.js
- [X] T011 [US1] Implement comma-separated value splitting for categories field in scripts/excel-to-cards.js
- [X] T012 [US1] Implement comma-separated value splitting for types field in scripts/excel-to-cards.js
- [X] T013 [US1] Implement lowercase normalization for categories, types, visibility in scripts/excel-to-cards.js
- [X] T014 [US1] Implement duplicate title detection (keep first, skip subsequent) in scripts/excel-to-cards.js
- [X] T015 [US1] Implement progress output (row count found, "Converting..." status) and success message in scripts/excel-to-cards.js

**Checkpoint**: Script converts valid Excel files to correctly structured cards.json. Duplicates are skipped with warnings. Run `npm run dev` to verify cards display correctly in catalog UI.

---

## Phase 4: User Story 2 - Validate Excel Data During Conversion (Priority: P2)

**Goal**: Warn users about data quality issues without blocking output generation.

**Independent Test**: Run `npm run import-cards -- ./test-invalid.xlsx` with an Excel file containing intentional errors (empty title, invalid category, invalid type, invalid visibility). Verify warnings are displayed and output is still generated.

### Implementation for User Story 2

- [X] T016 [US2] Define validation constants (allowed categories, types, visibility values) in scripts/excel-to-cards.js
- [X] T017 [US2] Implement empty title warning (row number + field name) in scripts/excel-to-cards.js
- [X] T018 [P] [US2] Implement invalid category warning (show invalid value + allowed list) in scripts/excel-to-cards.js
- [X] T019 [P] [US2] Implement invalid type warning (show invalid value + allowed list) in scripts/excel-to-cards.js
- [X] T020 [P] [US2] Implement invalid visibility warning (show invalid value + allowed list) in scripts/excel-to-cards.js
- [X] T021 [US2] Implement warnings summary output (total warnings, duplicates skipped, cards converted) in scripts/excel-to-cards.js
- [X] T022 [US2] Implement empty file handling (generate empty array with warning) in scripts/excel-to-cards.js

**Checkpoint**: Script shows all validation warnings with row numbers. Output file is still generated despite warnings. Summary shows totals.

---

## Phase 5: Polish & Verification

**Purpose**: Final verification and documentation

- [X] T023 [P] Create sample test Excel file with valid data in archive/test-catalog-valid.xlsx
- [X] T024 [P] Create sample test Excel file with validation errors in archive/test-catalog-invalid.xlsx
- [X] T025 Run full quickstart.md workflow verification (export → edit → import cycle)
- [X] T026 Add JSDoc comments to all functions in scripts/excel-to-cards.js
- [X] T027 Update README.md with import-cards usage (if README documents npm scripts) - N/A: README is minimal

**Checkpoint**: Quickstart workflow completes successfully. All edge cases from spec verified manually.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (CLI + File I/O)
    ↓
Phase 3: User Story 1 (P1 - Core Conversion) ← MVP COMPLETE
    ↓
Phase 4: User Story 2 (P2 - Validation Warnings)
    ↓
Phase 5: Polish & Verification
```

### Task Dependencies Within Phases

**Phase 2 (Sequential)**:
- T003 → T004 → T005 → T006 → T007 (each builds on previous)

**Phase 3 (Mostly Sequential)**:
- T008 → T009 (headers before validation)
- T010 → T011, T012 (base transform before field-specific)
- T011, T012 → T013 (split before normalize)
- T013 → T014 (normalize before duplicate check)
- All above → T015 (output last)

**Phase 4 (Partial Parallel)**:
- T016 first (constants needed for validation)
- T017, T018, T019, T020 can run in parallel (different validation types)
- T21 depends on T17-T20 (summary needs all warnings)
- T022 independent (empty file edge case)

**Phase 5 (Parallel)**:
- T023, T024 can run in parallel (different files)
- T025 depends on T023, T024 (needs test files)
- T026, T027 independent

---

## Parallel Execution Examples

### Phase 4: Validation Warnings (after T016 completes)

```bash
# These validation tasks can run in parallel (different validation types):
T018: "Implement invalid category warning in scripts/excel-to-cards.js"
T019: "Implement invalid type warning in scripts/excel-to-cards.js"
T020: "Implement invalid visibility warning in scripts/excel-to-cards.js"
```

### Phase 5: Test Files

```bash
# These test file creation tasks can run in parallel:
T023: "Create sample test Excel file with valid data in archive/test-catalog-valid.xlsx"
T024: "Create sample test Excel file with validation errors in archive/test-catalog-invalid.xlsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T007)
3. Complete Phase 3: User Story 1 (T008-T015)
4. **STOP and VALIDATE**: Test with real Excel file, verify catalog displays correctly
5. Ready for use - validation warnings can be added incrementally

### Full Feature

1. Complete MVP (Phases 1-3)
2. Add User Story 2 (Phase 4) for validation warnings
3. Complete Phase 5 for polish and sample files

---

## Manual Test Scenarios

Since no test framework exists, verify these scenarios manually:

| Scenario | Test Command | Expected Result |
|----------|--------------|-----------------|
| Valid Excel | `npm run import-cards -- ./archive/test-catalog-valid.xlsx` | Success, cards.json updated |
| Missing file | `npm run import-cards -- ./missing.xlsx` | Error: file not found |
| Corrupted file | `npm run import-cards -- ./corrupted.xlsx` | Error: failed to read |
| >1000 rows | `npm run import-cards -- ./large.xlsx` | Error: exceeds row limit |
| Missing columns | `npm run import-cards -- ./missing-cols.xlsx` | Error: missing required columns |
| Empty title | (include in test-invalid.xlsx) | Warning logged, row included |
| Invalid category | (include in test-invalid.xlsx) | Warning logged, value included |
| Duplicate title | (include in test-invalid.xlsx) | Warning logged, row skipped |
| Empty file | `npm run import-cards -- ./empty.xlsx` | Warning, empty array written |

---

## Rollout Notes

- **Feature Flag**: Not applicable (CLI tool, not web feature)
- **Migration**: Not applicable (new script, no schema changes)
- **Observability**: Console output provides all logging (per cli-contract.md)
- **Backwards Compatibility**: Does not affect existing `cards-to-excel` or catalog functionality

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 27 |
| Phase 1 (Setup) | 2 tasks |
| Phase 2 (Foundational) | 5 tasks |
| Phase 3 (US1 - MVP) | 8 tasks |
| Phase 4 (US2 - Validation) | 7 tasks |
| Phase 5 (Polish) | 5 tasks |
| Parallelizable Tasks | 7 tasks marked [P] |
| MVP Task Count | 15 tasks (Phases 1-3) |

---

## Notes

- All tasks modify or create scripts/excel-to-cards.js (except T001, T023-T025, T027)
- Single file focus limits parallelization within phases
- MVP (User Story 1) is fully functional without validation warnings
- Test files in archive/ for manual verification workflow
