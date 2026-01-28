# Tasks: Cards.json to Excel Converter

**Input**: Design documents from `/specs/002-cards-to-excel/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Manual validation per quickstart.md (no test framework in existing project)

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US1]** / **[US2]**: User story label for traceability

---

## Phase 1: Setup

**Purpose**: Add dependency and create scripts directory

- [X] T001 Create scripts/ directory at repository root
- [X] T002 Add xlsx devDependency to package.json: `npm install --save-dev xlsx`
- [X] T003 Add export-cards npm script to package.json: `"export-cards": "node scripts/cards-to-excel.js"`

**Checkpoint**: `npm install` succeeds; scripts/ directory exists

---

## Phase 2: User Story 1 - Export Cards Data to Excel (Priority: P1) 🎯 MVP

**Goal**: Export cards.json to Excel with default output path

**Independent Test**: Run `npm run export-cards` and verify cards-export.xlsx is created with all 31 cards

### Implementation for User Story 1

- [X] T004 [US1] Create scripts/cards-to-excel.js with ES module boilerplate and xlsx import
- [X] T005 [US1] Implement readCardsJson() function to read and parse src/data/cards.json
- [X] T006 [US1] Implement transformToRows() function to convert Card[] to ExcelRow[] (arrays → comma-separated strings)
- [X] T007 [US1] Implement writeExcelFile() function using xlsx library to write .xlsx file
- [X] T008 [US1] Add console output for progress messages per CLI contract
- [X] T009 [US1] Add error handling for missing file, invalid JSON, and array validation
- [X] T010 [US1] Wire up main() function with default output path ./cards-export.xlsx

### Manual Validation - User Story 1

- [X] T011 [US1] Run `npm run export-cards` and verify:
  - Console shows "Reading cards from src/data/cards.json..."
  - Console shows "Found 31 cards"
  - Console shows "✓ Exported to ./cards-export.xlsx"
  - Exit code is 0
- [X] T012 [US1] Open cards-export.xlsx in Excel/Sheets/LibreOffice and verify:
  - First row has headers: title, description, categories, types, visibility, link
  - 31 data rows present (one per card)
  - Categories and types columns contain comma-separated values
- [X] T013 [US1] Test edge case: Rename cards.json temporarily, run script, verify error message

**Checkpoint**: MVP complete - `npm run export-cards` produces valid Excel file

---

## Phase 3: User Story 2 - Specify Output Location (Priority: P2)

**Goal**: Accept optional output path argument

**Independent Test**: Run `npm run export-cards -- ./test-output.xlsx` and verify file created at specified path

### Implementation for User Story 2

- [X] T014 [US2] Update main() to parse process.argv for optional output path argument
- [X] T015 [US2] Add output directory existence validation with clear error message
- [X] T016 [US2] Update console output to show actual output path used

### Manual Validation - User Story 2

- [X] T017 [US2] Run `npm run export-cards -- ./custom-output.xlsx` and verify file created at ./custom-output.xlsx
- [X] T018 [US2] Run `node scripts/cards-to-excel.js ./exports/test.xlsx` with non-existent ./exports/ directory and verify error message
- [X] T019 [US2] Run `npm run export-cards` (no argument) and verify default ./cards-export.xlsx still works

**Checkpoint**: Custom output path working; default path preserved

---

## Phase 4: Polish & Validation

**Purpose**: Final cleanup and documentation

- [X] T020 [P] Add .gitignore entry for *.xlsx in repository root (prevent accidental commits of exports)
- [X] T021 [P] Update README.md with export-cards usage instructions
- [X] T022 Run quickstart.md validation checklist to confirm all criteria pass
- [ ] T023 Verify round-trip compatibility: export → re-import via 001-excel-to-cards (when implemented)

**Checkpoint**: Feature complete and documented

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: User Story 1 (MVP)
    ↓
Phase 3: User Story 2
    ↓
Phase 4: Polish
```

### Task Dependencies Within Phases

**Phase 1** (sequential):
- T001 → T002 → T003 (scripts/ must exist before npm script, dependency must be installed)

**Phase 2** (mostly sequential):
- T004 → T005 → T006 → T007 → T008 → T009 → T010 (build up functionality incrementally)
- T011, T012, T013 (validation after implementation)

**Phase 3** (sequential):
- T014 → T015 → T016 (extend existing script)
- T017, T018, T019 (validation after implementation)

**Phase 4** (parallelizable):
- T020 [P] and T021 [P] can run in parallel
- T022 sequential (depends on all prior work)
- T023 depends on 001-excel-to-cards feature (may be deferred)

### Parallel Opportunities

| Tasks | Parallelizable | Reason |
|-------|----------------|--------|
| T020, T021 | ✅ Yes | Different files (.gitignore, README.md) |
| T011, T012, T013 | ❌ No | Sequential validation of same script |
| All Phase 1 tasks | ❌ No | Order-dependent setup |

---

## Rollout Strategy

### No Feature Flag Required

This is a developer tooling script, not user-facing functionality:
- Script only executes when explicitly invoked via CLI
- No impact on existing catalog frontend
- No migration needed - additive change only

### Deployment Checklist

- [ ] Merge branch to main
- [ ] Verify `npm install` completes without errors
- [ ] Verify `npm run export-cards` works from fresh clone
- [ ] Document in team runbook if applicable

---

## Observability

### Console Output (Built-in Logging)

The script provides observability through structured console messages:

```
Reading cards from src/data/cards.json...    # Start of execution
Found 31 cards                                # Data loaded successfully
Writing Excel file...                         # Processing
✓ Exported to ./cards-export.xlsx            # Success with output path
```

Error cases:
```
Error: cards.json not found at src/data/cards.json
Error: Failed to parse cards.json - [details]
Error: Output directory does not exist: [path]
```

### Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | File created |
| 1 | Error | Check console for details |

No additional observability tooling required for CLI script.

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 23 |
| Phase 1 (Setup) | 3 tasks |
| Phase 2 (US1 - MVP) | 10 tasks |
| Phase 3 (US2) | 6 tasks |
| Phase 4 (Polish) | 4 tasks |
| Parallel opportunities | T020 + T021 |
| Migration steps | None (additive) |
| Feature flags | None required |

**MVP Scope**: Complete Phase 1 + Phase 2 (13 tasks) for minimum viable export functionality.
