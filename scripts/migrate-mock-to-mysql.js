#!/usr/bin/env node

/**
 * Le Trousseau - Mock to MySQL Migration Script
 * 
 * This script migrates mock data (JSON exports) to Hostinger MySQL database
 * 
 * Usage:
 *   node scripts/migrate-mock-to-mysql.js --file=exports/submissions.json
 *   node scripts/migrate-mock-to-mysql.js --file=exports/submissions.json --dry-run
 * 
 * Requirements:
 *   npm install mysql2 dotenv
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Uncomment when ready to implement
// const mysql = require('mysql2/promise');

const args = process.argv.slice(2);
const fileArg = args.find(a => a.startsWith('--file='));
const dryRun = args.includes('--dry-run');

if (!fileArg) {
  console.error('❌ Missing --file argument');
  console.log('Usage: node migrate-mock-to-mysql.js --file=exports/submissions.json [--dry-run]');
  process.exit(1);
}

const filePath = fileArg.split('=')[1];

async function migrate() {
  console.log('🚀 Le Trousseau - Migration Script');
  console.log('=====================================');
  console.log(`📁 Input file: ${filePath}`);
  console.log(`🔧 Dry run: ${dryRun ? 'YES' : 'NO'}`);
  console.log('');

  // Read JSON file
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`📊 Found ${data.length} submissions to migrate`);
  console.log('');

  // Validate environment variables
  const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0 && !dryRun) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.log('');
    console.log('💡 Add these to your .env file or set them in your environment');
    process.exit(1);
  }

  if (dryRun) {
    console.log('🧪 DRY RUN MODE - No data will be written');
    console.log('');
    console.log('Preview of SQL statements that would be executed:');
    console.log('');
    
    data.slice(0, 3).forEach(submission => {
      console.log(generateInsertSQL(submission));
      console.log('');
    });
    
    if (data.length > 3) {
      console.log(`... and ${data.length - 3} more statements`);
    }
    
    console.log('✅ Dry run complete');
    return;
  }

  // Real migration (implement when needed)
  console.log('⚠️  Real migration not implemented yet');
  console.log('');
  console.log('TODO: Implement MySQL connection and insertion');
  console.log('');
  console.log('Example implementation:');
  console.log('```javascript');
  console.log('const connection = await mysql.createConnection({');
  console.log('  host: process.env.DB_HOST,');
  console.log('  database: process.env.DB_NAME,');
  console.log('  user: process.env.DB_USER,');
  console.log('  password: process.env.DB_PASS,');
  console.log('});');
  console.log('');
  console.log('for (const submission of data) {');
  console.log('  await connection.execute(generateInsertSQL(submission));');
  console.log('}');
  console.log('```');
}

function generateInsertSQL(submission) {
  const fields = {
    id: submission.id,
    timestamp: submission.timestamp,
    source: submission.source,
    consent: submission.consent ? 1 : 0,
    name: submission.name || null,
    email: submission.email || null,
    phone: submission.phone || null,
  };

  // Add source-specific fields
  switch (submission.source) {
    case 'contact':
      fields.subject = submission.subject || null;
      fields.message = submission.message || null;
      fields.newsletter = submission.newsletter ? 1 : 0;
      break;
    
    case 'quiz':
      fields.quiz_user_info = JSON.stringify(submission.userInfo);
      fields.quiz_answers = JSON.stringify(submission.answers);
      fields.quiz_results = JSON.stringify(submission.results);
      break;
    
    case 'booking':
      fields.formula = submission.formula || null;
      fields.participants = submission.participants || null;
      fields.location = submission.location || null;
      fields.equipment = submission.equipment ? JSON.stringify(submission.equipment) : null;
      fields.message = submission.message || null;
      break;
  }

  const columns = Object.keys(fields).join(', ');
  const values = Object.values(fields)
    .map(v => v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "\\'")}'` : v)
    .join(', ');

  return `INSERT INTO submissions (${columns}) VALUES (${values});`;
}

// Run migration
migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
