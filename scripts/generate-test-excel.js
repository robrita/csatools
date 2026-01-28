#!/usr/bin/env node
/**
 * Generate test Excel files for excel-to-cards.js testing
 * Creates: archive/test-catalog-valid.xlsx and archive/test-catalog-invalid.xlsx
 */

import XLSX from 'xlsx';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const archiveDir = join(__dirname, '..', 'archive');

// Ensure archive directory exists
mkdirSync(archiveDir, { recursive: true });

/**
 * Create valid test Excel file with 5 correct entries
 */
function createValidTestFile() {
  const data = [
    // Header row
    ['title', 'description', 'categories', 'types', 'visibility', 'link', 'hidden'],
    // Valid data rows
    ['GPT-RAG', 'Enterprise-grade GPT assistant framework with RAG capabilities', 'ai-application, ai-agent', 'code, design guidance', 'public', 'https://github.com/Azure/gpt-rag', 'false'],
    ['Data Analytics Starter', 'Quick start template for Azure data analytics', 'data, analytics', 'code', 'public', 'https://example.com/data-analytics', 'false'],
    ['Migration Guide', 'Step-by-step migration guidance for cloud adoption', 'data', 'migration guidance, blog', 'public', 'https://example.com/migration', 'false'],
    ['Internal Dashboard', 'Private analytics dashboard for team metrics', 'analytics', 'deployabledemo', 'private', '', 'true'],
    ['AI Level Up', 'Training materials for AI/ML concepts', 'ai-application', 'level up, public documentation', 'public', 'https://example.com/ai-levelup', 'false']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cards');
  
  const filePath = join(archiveDir, 'test-catalog-valid.xlsx');
  XLSX.writeFile(workbook, filePath);
  console.log(`✓ Created: ${filePath}`);
}

/**
 * Create invalid test Excel file with validation errors
 */
function createInvalidTestFile() {
  const data = [
    // Header row
    ['title', 'description', 'categories', 'types', 'visibility', 'link', 'hidden'],
    // Row with empty title (warning)
    ['', 'This card has no title', 'data', 'code', 'public', 'https://example.com/no-title', 'false'],
    // Row with invalid category (warning)
    ['Invalid Category Card', 'Card with unknown category', 'unknown-category, data', 'code', 'public', 'https://example.com/bad-cat', 'false'],
    // Row with invalid type (warning)
    ['Invalid Type Card', 'Card with unknown type', 'analytics', 'invalid-type, code', 'public', 'https://example.com/bad-type', 'false'],
    // Row with invalid visibility (warning)
    ['Invalid Visibility Card', 'Card with unknown visibility', 'ai-application', 'blog', 'internal', 'https://example.com/bad-vis', 'false'],
    // Duplicate title (second occurrence should be skipped)
    ['Duplicate Card', 'First occurrence of this card', 'data', 'code', 'public', 'https://example.com/dup1', 'false'],
    ['Duplicate Card', 'Second occurrence - should be skipped', 'analytics', 'blog', 'private', 'https://example.com/dup2', 'false'],
    // Valid card to show mixed results
    ['Valid Card', 'This card is perfectly valid', 'ai-agent', 'onlinedemo', 'public', 'https://example.com/valid', 'true']
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cards');
  
  const filePath = join(archiveDir, 'test-catalog-invalid.xlsx');
  XLSX.writeFile(workbook, filePath);
  console.log(`✓ Created: ${filePath}`);
}

// Run generation
console.log('Generating test Excel files...\n');
createValidTestFile();
createInvalidTestFile();
console.log('\nDone! Test files created in archive/ directory.');
