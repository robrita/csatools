# Quickstart: Cards.json to Excel Converter

**Feature**: 002-cards-to-excel  
**Date**: 2026-01-28

## Prerequisites

- Node.js 18 or later
- npm installed
- Project dependencies installed (`npm install`)

## Installation

After implementing this feature, the export functionality is available via:

```bash
npm run export-cards
```

## Basic Usage

### Export cards to Excel

```bash
npm run export-cards
```

This creates `cards-export.xlsx` in the current directory containing all cards from `src/data/cards.json`.

### Export to a specific location

```bash
npm run export-cards -- ./backups/catalog.xlsx
```

## What You'll Get

The exported Excel file contains:

| Column | Example |
|--------|---------|
| title | "GPT-RAG" |
| description | "Enterprise-grade GPT assistant framework..." |
| categories | "ai-application" |
| types | "code" |
| visibility | "public" |
| link | "https://github.com/Azure/gpt-rag" |

- First row contains headers
- One card per row
- Arrays (categories, types) shown as comma-separated values
- Compatible with Microsoft Excel, Google Sheets, and LibreOffice Calc

## Validation Checklist

After implementation, verify:

- [ ] `npm run export-cards` creates `cards-export.xlsx`
- [ ] Excel file opens without errors in spreadsheet application
- [ ] Row count equals number of cards in cards.json plus 1 (header)
- [ ] All 6 columns present with correct headers
- [ ] Categories and types display as comma-separated lists
- [ ] Re-importing via 001-excel-to-cards produces identical cards.json

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "cards.json not found" | Ensure you're running from project root directory |
| "Cannot find module 'xlsx'" | Run `npm install` to install dependencies |
| "Output directory does not exist" | Create the target directory first, or use default path |
| Empty Excel file | Check that cards.json contains data (not empty array) |
