# Implementation Plan: Excel to Cards.json Converter

**Branch**: `001-excel-to-cards` | **Date**: 2026-01-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-excel-to-cards/spec.md`

## Summary

Add a Node.js CLI script to convert Excel (.xlsx) files to cards.json format. The script mirrors the existing `cards-to-excel.js` converter, using the same `xlsx` library and coding patterns. Includes validation warnings for data quality issues without blocking output generation.

## Technical Context

**Language/Version**: Node.js (ES modules, `"type": "module"` in package.json)  
**Primary Dependencies**: xlsx ^0.18.5 (already installed)  
**Storage**: File-based (reads .xlsx, writes src/data/cards.json)  
**Testing**: Manual testing via `npm run import-cards` (no test framework in project)  
**Target Platform**: Local development machine (cross-platform Node.js)  
**Project Type**: Single project - CLI script addition  
**Performance Goals**: <30 seconds for up to 1000 rows  
**Constraints**: 1000 rows hard maximum, fail on corrupted files, warn on validation issues  
**Scale/Scope**: Single script file (~150-200 LOC), mirrors existing cards-to-excel.js patterns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Brownfield-First | Follow existing patterns | ✅ PASS | Mirrors `cards-to-excel.js` structure, uses existing `xlsx` dependency |
| II. Backwards Compatibility | Preserve existing schema | ✅ PASS | Writes to existing `cards.json` format, no schema changes |
| III. Incremental Changes | Minimal focused change | ✅ PASS | Single script file addition, one npm script |
| IV. Data Integrity | Validate card data | ✅ PASS | Validates categories/types against allowed values, warns on issues |
| V. Security & Privacy | No sensitive data | ✅ PASS | File-based local tool, no network or secrets |
| Prohibited Items | No new frameworks | ✅ PASS | Uses existing `xlsx` library only |

**Gate Result**: ✅ PASS - All constitution principles satisfied

**Post-Design Re-check (Phase 1)**: ✅ PASS - Design artifacts (data-model.md, cli-contract.md) confirm no new dependencies, existing patterns followed, backwards compatible output format.

## Project Structure

### Documentation (this feature)

```text
specs/001-excel-to-cards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── cli-contract.md
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
scripts/
├── cards-to-excel.js    # Existing: JSON → Excel export
└── excel-to-cards.js    # NEW: Excel → JSON import

src/data/
└── cards.json           # Output target (existing file)

package.json             # Add "import-cards" script
```

**Structure Decision**: Single script file in `scripts/` directory following the established pattern from `cards-to-excel.js`. No new directories or structural changes required.

## Complexity Tracking

> No constitution violations to justify - design is fully compliant.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
