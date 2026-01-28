<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0
Added sections:
  - Core Principles (5 principles)
  - Technology Constraints
  - Development Workflow
  - Governance
Templates requiring updates:
  ✅ plan-template.md - Compatible (no changes needed)
  ✅ spec-template.md - Compatible (no changes needed)
  ✅ tasks-template.md - Compatible (no changes needed)
Follow-up TODOs: None
-->

# Solution Catalog Constitution

## Core Principles

### I. Brownfield-First

All changes MUST respect the existing codebase structure and patterns:
- No new frameworks, build tools, or major architectural changes unless explicitly required by specification
- Follow existing component patterns (`src/components/`) with functional components returning template strings
- Reuse existing utilities from `src/utils/` before creating new ones
- Card data MUST remain in `src/data/cards.json` format

**Rationale**: This is a stable, working catalog. Introducing new patterns increases maintenance burden and risks regressions.

### II. Backwards Compatibility (NON-NEGOTIABLE)

Every change MUST preserve backwards compatibility:
- Existing card schema fields (`title`, `description`, `categories`, `types`, `visibility`, `link`) MUST remain supported
- Filter and search functionality MUST continue working after any modification
- Static deployments via `vite build` MUST produce valid output at existing paths
- External links to catalog items MUST NOT break

**Rationale**: Users and documentation reference existing functionality. Breaking changes disrupt dependent workflows.

### III. Incremental Changes

Prefer minimal, focused changes over large refactors:
- One concern per change (e.g., add a filter, update styling, fix a bug)
- Changes SHOULD be independently deployable and testable
- Avoid bundling unrelated modifications
- Validate changes manually in dev server (`npm run dev`) before committing

**Rationale**: Small changes are easier to review, test, and rollback if issues arise.

### IV. Data Integrity

Card data in `cards.json` MUST remain valid and complete:
- All required fields MUST be present: `title`, `description`, `categories`, `types`, `visibility`, `link`
- Links MUST point to valid URLs (empty string acceptable only for unreleased items)
- Categories MUST use existing values (`data`, `analytics`, `ai-application`, `ai-agent`)
- Types MUST use existing values (`code`, `design guidance`, `migration guidance`, `blog`, `public documentation`, `level up`, `onlinedemo`, `deployabledemo`)

**Rationale**: Data consistency ensures filtering and display work correctly across all cards.

### V. Security & Privacy

Input handling and external links MUST follow security best practices:
- User input (search terms) MUST be sanitized before rendering
- External links MUST use `target="_blank"` with `rel="noopener noreferrer"`
- No sensitive data (credentials, API keys, PII) in client-side code or data files
- GitHub repository URLs for private visibility items are acceptable

**Rationale**: Static sites are publicly accessible; security prevents XSS and information leakage.

## Technology Constraints

**Stack**: Vite 5.x static site with vanilla JavaScript (ES modules)

**Structure**:
- Entry: `index.html` → `src/main.js`
- Components: `src/components/` (functional, return HTML strings)
- Data: `src/data/cards.json`
- Utilities: `src/utils/` (formatters, constants, icons)
- Styles: `src/styles.css`

**Build & Deploy**:
- Development: `npm run dev`
- Production: `npm run build` → `dist/`
- Deployment: GitHub Pages (configured via `base` in `vite.config.js`)

**Prohibited**:
- React, Vue, Angular, or other frontend frameworks
- Server-side rendering or API backends
- CSS preprocessors (use plain CSS)
- Package additions without explicit justification

## Development Workflow

**Before Starting**:
1. Run `npm install` if dependencies changed
2. Start dev server with `npm run dev`
3. Verify existing functionality works

**During Development**:
1. Make incremental changes
2. Test in browser after each change
3. Verify filters and search still function
4. Check responsive layout

**Before Committing**:
1. Run `npm run build` to verify production build
2. Review changed files for unintended modifications
3. Ensure no console errors in browser

## Governance

This constitution supersedes ad-hoc decisions. Amendments require:
1. Clear justification for the change
2. Impact assessment on existing functionality
3. Version increment following semantic versioning
4. Update to this document with new `Last Amended` date

All contributions MUST verify compliance with these principles. When in doubt, favor simpler solutions that preserve existing behavior.

**Version**: 1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
