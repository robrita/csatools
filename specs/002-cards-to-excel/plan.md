# Implementation Plan: Cards.json to Excel Converter

**Branch**: `002-cards-to-excel` | **Date**: 2026-01-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-cards-to-excel/spec.md`

## Summary

Node.js CLI script to export cards.json data to Excel (.xlsx) format. Converts JSON arrays (categories, types) to comma-separated strings. Supports optional output path argument with sensible defaults.

## Technical Context

**Language/Version**: JavaScript (ES Modules), Node.js 18+  
**Primary Dependencies**: xlsx (SheetJS) for Excel generation - minimal, battle-tested library  
**Storage**: File-based (reads src/data/cards.json, writes .xlsx output)  
**Testing**: Manual validation (no test framework in existing project)  
**Target Platform**: Node.js CLI (developer/maintainer workstation)  
**Project Type**: Single project - CLI script addition to existing static site  
**Performance Goals**: <10 seconds for 500 cards (per SC-001)  
**Constraints**: Must produce files compatible with Excel, Google Sheets, LibreOffice  
**Scale/Scope**: ~30-50 cards currently, designed for up to 500

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Brownfield-First | ✅ PASS | CLI script in scripts/ folder, no changes to existing src/ components |
| II. Backwards Compatibility | ✅ PASS | Read-only operation on cards.json, no modifications to existing data |
| III. Incremental Changes | ✅ PASS | Single-purpose script, independently testable |
| IV. Data Integrity | ✅ PASS | Export preserves all fields; round-trip compatible with 001-excel-to-cards |
| V. Security & Privacy | ✅ PASS | No user input rendering, no external data ingestion |

**New Dependency Justification**: xlsx (SheetJS) required to generate .xlsx files. This is:
- A well-established, widely-used library (30M+ weekly npm downloads)
- Added as devDependency only (not bundled in frontend build)
- No alternative without external dependency for proper .xlsx generation

## Project Structure

### Documentation (this feature)

```text
specs/002-cards-to-excel/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (CLI interface contract)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
scripts/                 # NEW - CLI tools directory
└── cards-to-excel.js    # Export script

src/
├── data/
│   └── cards.json       # Source data (read-only for this feature)
├── components/          # Existing - unchanged
├── utils/               # Existing - unchanged
├── main.js              # Existing - unchanged
└── styles.css           # Existing - unchanged

package.json             # Add xlsx devDependency and export script
```

**Structure Decision**: Add `scripts/` directory for CLI tools. This follows brownfield principle by isolating CLI tooling from the existing frontend source structure. The xlsx dependency is added as devDependency since it's only used for CLI scripts, not bundled in production builds.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Adding xlsx devDependency | Required for .xlsx file generation | Pure JS xlsx generation is complex and error-prone; CSV alternative rejected because spec requires .xlsx format compatible with Excel/Sheets/LibreOffice |

No other constitution violations identified.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Design Validation |
|-----------|--------|-------------------|
| I. Brownfield-First | ✅ PASS | scripts/ directory isolates CLI tools from src/; no existing patterns changed |
| II. Backwards Compatibility | ✅ PASS | Read-only operation; export format designed for round-trip with 001-excel-to-cards |
| III. Incremental Changes | ✅ PASS | Single script file + package.json update; minimal footprint |
| IV. Data Integrity | ✅ PASS | All 6 card fields preserved; arrays converted reversibly to comma-separated strings |
| V. Security & Privacy | ✅ PASS | No external input; file operations use explicit paths |

**Conclusion**: Design complies with all constitution principles. Ready for Phase 2 (tasks generation via `/speckit.tasks`).

