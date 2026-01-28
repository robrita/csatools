#!/usr/bin/env node

/**
 * Excel to Cards.json Converter
 *
 * Converts an Excel (.xlsx) file to cards.json format for the Solution Catalog.
 *
 * Usage:
 *   npm run import-cards -- <input.xlsx>              # Default: src/data/cards.json
 *   npm run import-cards -- <input.xlsx> <output.json> # Custom output path
 *   node scripts/excel-to-cards.js <input.xlsx>       # Direct invocation
 *
 * @see specs/001-excel-to-cards/contracts/cli-contract.md
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import XLSX from 'xlsx';

// Constants
const DEFAULT_OUTPUT_PATH = 'src/data/cards.json';
const MAX_ROWS = 1000;
const REQUIRED_COLUMNS = ['title', 'description', 'categories', 'types', 'visibility', 'link'];

// Validation constants
const ALLOWED_CATEGORIES = ['data', 'analytics', 'ai-application', 'ai-agent'];
const ALLOWED_TYPES = ['code', 'design guidance', 'migration guidance', 'blog', 'public documentation', 'level up', 'onlinedemo', 'deployabledemo'];
const ALLOWED_VISIBILITY = ['public', 'private'];

/**
 * Parse command line arguments
 * @returns {{ inputPath: string, outputPath: string }}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/excel-to-cards.js <input.xlsx> [output.json]');
    console.error('');
    console.error('Arguments:');
    console.error('  input.xlsx   Path to the Excel file to convert (required)');
    console.error('  output.json  Path for output JSON file (default: src/data/cards.json)');
    process.exit(1);
  }
  
  return {
    inputPath: args[0],
    outputPath: args[1] || DEFAULT_OUTPUT_PATH
  };
}

/**
 * Validate that the input file exists and has .xlsx extension
 * @param {string} inputPath 
 */
function validateInputFile(inputPath) {
  if (!existsSync(inputPath)) {
    console.error(`Error: Excel file not found at ${inputPath}`);
    process.exit(1);
  }
  
  if (!inputPath.toLowerCase().endsWith('.xlsx')) {
    console.error(`Error: Input file must be an .xlsx file`);
    process.exit(1);
  }
}

/**
 * Read Excel file and extract rows from first sheet
 * @param {string} inputPath 
 * @returns {any[][]} Array of row arrays
 */
function readExcelFile(inputPath) {
  console.log(`Reading Excel file from ${inputPath}...`);
  
  let workbook;
  try {
    workbook = XLSX.readFile(inputPath);
  } catch (err) {
    console.error(`Error: Failed to read Excel file - ${err.message}`);
    process.exit(1);
  }
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  return rows;
}

/**
 * Check row count and fail if exceeds limit
 * @param {any[][]} rows 
 */
function checkRowLimit(rows) {
  const dataRowCount = rows.length - 1; // Exclude header
  
  if (dataRowCount > MAX_ROWS) {
    console.error(`Error: File exceeds ${MAX_ROWS} row limit (found ${dataRowCount} data rows)`);
    process.exit(1);
  }
  
  console.log(`Found ${dataRowCount} data rows`);
  return dataRowCount;
}

/**
 * Extract headers and create column index mapping
 * @param {any[]} headerRow 
 * @returns {{ columnMap: Record<string, number>, missingColumns: string[] }}
 */
function mapHeaders(headerRow) {
  const columnMap = {};
  const normalizedHeaders = headerRow.map((h, i) => {
    const normalized = String(h || '').trim().toLowerCase();
    if (REQUIRED_COLUMNS.includes(normalized)) {
      columnMap[normalized] = i;
    }
    return normalized;
  });
  
  const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in columnMap));
  
  return { columnMap, missingColumns };
}

/**
 * Split comma-separated string into trimmed, lowercase array
 * @param {string} value 
 * @returns {string[]}
 */
function splitAndNormalize(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }
  return value
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(v => v.length > 0);
}

/**
 * Transform a data row into a Card object
 * @param {any[]} row 
 * @param {Record<string, number>} columnMap 
 * @returns {object}
 */
function transformRow(row, columnMap) {
  const getString = (col) => {
    const idx = columnMap[col];
    const val = row[idx];
    return typeof val === 'string' ? val.trim() : String(val || '').trim();
  };
  
  return {
    title: getString('title'),
    description: getString('description'),
    categories: splitAndNormalize(getString('categories')),
    types: splitAndNormalize(getString('types')),
    visibility: getString('visibility').toLowerCase(),
    link: getString('link')
  };
}

/**
 * Validate a card and collect warnings
 * @param {object} card 
 * @param {number} rowNum 
 * @param {object[]} warnings 
 */
function validateCard(card, rowNum, warnings) {
  // Empty title warning
  if (!card.title) {
    warnings.push({ row: rowNum, field: 'title', message: 'Empty title field' });
  }
  
  // Invalid categories warning
  for (const cat of card.categories) {
    if (!ALLOWED_CATEGORIES.includes(cat)) {
      warnings.push({
        row: rowNum,
        field: 'categories',
        value: cat,
        message: `Invalid category '${cat}'. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`
      });
    }
  }
  
  // Invalid types warning
  for (const type of card.types) {
    if (!ALLOWED_TYPES.includes(type)) {
      warnings.push({
        row: rowNum,
        field: 'types',
        value: type,
        message: `Invalid type '${type}'. Allowed: ${ALLOWED_TYPES.join(', ')}`
      });
    }
  }
  
  // Invalid visibility warning
  if (card.visibility && !ALLOWED_VISIBILITY.includes(card.visibility)) {
    warnings.push({
      row: rowNum,
      field: 'visibility',
      value: card.visibility,
      message: `Invalid visibility '${card.visibility}'. Allowed: ${ALLOWED_VISIBILITY.join(', ')}`
    });
  }
}

/**
 * Write cards array to JSON file
 * @param {object[]} cards 
 * @param {string} outputPath 
 */
function writeJsonFile(cards, outputPath) {
  const outputDir = dirname(outputPath);
  if (outputDir !== '.' && outputDir !== '' && !existsSync(outputDir)) {
    console.error(`Error: Output directory does not exist: ${outputDir}`);
    process.exit(1);
  }
  
  try {
    writeFileSync(outputPath, JSON.stringify(cards, null, 2) + '\n');
  } catch (err) {
    console.error(`Error: Failed to write JSON file - ${err.message}`);
    process.exit(1);
  }
}

/**
 * Main entry point
 */
function main() {
  const { inputPath, outputPath } = parseArgs();
  
  // Validate input file
  validateInputFile(inputPath);
  
  // Read Excel file
  const rows = readExcelFile(inputPath);
  
  // Check for empty file
  if (rows.length === 0) {
    console.warn('Warning: Excel file contains no data rows');
    writeJsonFile([], outputPath);
    console.log(`✓ Converted 0 cards to ${outputPath}`);
    process.exit(0);
  }
  
  // Check row limit
  const dataRowCount = checkRowLimit(rows);
  
  // Handle empty data (only header row)
  if (dataRowCount === 0) {
    console.warn('Warning: Excel file contains no data rows');
    writeJsonFile([], outputPath);
    console.log(`✓ Converted 0 cards to ${outputPath}`);
    process.exit(0);
  }
  
  // Map headers
  const headerRow = rows[0];
  const { columnMap, missingColumns } = mapHeaders(headerRow);
  
  if (missingColumns.length > 0) {
    console.error(`Error: Missing required columns: ${missingColumns.join(', ')}`);
    console.error(`Required columns: ${REQUIRED_COLUMNS.join(', ')}`);
    process.exit(1);
  }
  
  console.log('Converting to cards.json format...');
  
  // Process data rows
  const cards = [];
  const warnings = [];
  const seenTitles = new Set();
  let duplicatesSkipped = 0;
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1; // 1-based row number for user feedback
    
    // Skip empty rows
    if (!row || row.length === 0 || row.every(cell => !cell)) {
      continue;
    }
    
    const card = transformRow(row, columnMap);
    
    // Check for duplicate title
    const normalizedTitle = card.title.trim().toLowerCase();
    if (normalizedTitle && seenTitles.has(normalizedTitle)) {
      warnings.push({
        row: rowNum,
        field: 'title',
        value: card.title,
        message: `Duplicate title '${card.title}' (skipped)`
      });
      duplicatesSkipped++;
      continue;
    }
    
    if (normalizedTitle) {
      seenTitles.add(normalizedTitle);
    }
    
    // Validate card
    validateCard(card, rowNum, warnings);
    
    cards.push(card);
  }
  
  // Display warnings
  if (warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    for (const w of warnings) {
      console.log(`  Row ${w.row}: ${w.message}`);
    }
    console.log('');
    console.log(`Summary: ${cards.length} cards converted, ${warnings.length} warnings, ${duplicatesSkipped} duplicate${duplicatesSkipped !== 1 ? 's' : ''} skipped`);
  }
  
  // Write output
  writeJsonFile(cards, outputPath);
  console.log(`✓ Converted ${cards.length} cards to ${outputPath}`);
  
  process.exit(0);
}

main();
