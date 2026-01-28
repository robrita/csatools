#!/usr/bin/env node

/**
 * Cards.json to Excel Converter
 * 
 * Exports src/data/cards.json to an Excel (.xlsx) file.
 * 
 * Usage:
 *   npm run export-cards                      # Default: ./cards-export.xlsx
 *   npm run export-cards -- ./output.xlsx     # Custom output path
 *   node scripts/cards-to-excel.js [path]     # Direct invocation
 * 
 * @see specs/002-cards-to-excel/contracts/cli-contract.md
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import * as XLSX from 'xlsx';

// Constants
const CARDS_JSON_PATH = 'src/data/cards.json';
const DEFAULT_OUTPUT_PATH = './cards-export.xlsx';
const SHEET_NAME = 'Cards';
const HEADERS = ['title', 'description', 'categories', 'types', 'visibility', 'link', 'hidden'];

/**
 * Read and parse cards.json file
 * @returns {Array} Array of card objects
 */
function readCardsJson() {
  console.log(`Reading cards from ${CARDS_JSON_PATH}...`);

  if (!existsSync(CARDS_JSON_PATH)) {
    console.error(`Error: cards.json not found at ${CARDS_JSON_PATH}`);
    process.exit(1);
  }

  let content;
  try {
    content = readFileSync(CARDS_JSON_PATH, 'utf-8');
  } catch (err) {
    console.error(`Error: Failed to read ${CARDS_JSON_PATH} - ${err.message}`);
    process.exit(1);
  }

  let cards;
  try {
    cards = JSON.parse(content);
  } catch (err) {
    console.error(`Error: Failed to parse cards.json - ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(cards)) {
    console.error('Error: cards.json must contain an array');
    process.exit(1);
  }

  console.log(`Found ${cards.length} cards`);
  return cards;
}

/**
 * Transform Card objects to Excel row format
 * Arrays (categories, types) are converted to comma-separated strings
 * @param {Array} cards - Array of card objects
 * @returns {Array} Array of row arrays for Excel
 */
function transformToRows(cards) {
  const rows = [HEADERS];

  for (const card of cards) {
    const row = [
      card.title || '',
      card.description || '',
      Array.isArray(card.categories) ? card.categories.join(', ') : (card.categories || ''),
      Array.isArray(card.types) ? card.types.join(', ') : (card.types || ''),
      card.visibility || '',
      card.link || '',
      card.hidden === true ? 'true' : 'false'
    ];
    rows.push(row);
  }

  return rows;
}

/**
 * Write rows to Excel file
 * @param {Array} rows - Array of row arrays
 * @param {string} outputPath - Path to write the Excel file
 */
function writeExcelFile(rows, outputPath) {
  console.log('Writing Excel file...');

  // Validate output directory exists
  const outputDir = dirname(outputPath);
  if (outputDir !== '.' && outputDir !== '' && !existsSync(outputDir)) {
    console.error(`Error: Output directory does not exist: ${outputDir}`);
    process.exit(1);
  }

  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);

  // Write file
  try {
    XLSX.writeFile(workbook, outputPath);
  } catch (err) {
    console.error(`Error: Failed to write Excel file - ${err.message}`);
    process.exit(1);
  }

  console.log(`✓ Exported to ${outputPath}`);
}

/**
 * Parse command line arguments for output path
 * @returns {string} Output path
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return args[0] || DEFAULT_OUTPUT_PATH;
}

/**
 * Main entry point
 */
function main() {
  const outputPath = parseArgs();
  const cards = readCardsJson();
  const rows = transformToRows(cards);
  writeExcelFile(rows, outputPath);
  process.exit(0);
}

main();
