#!/usr/bin/env node
/**
 * Encode Dialogflow service account JSON to Base64 for Render.com
 * Usage: node scripts/encode-credentials.js
 */

const fs = require('fs');
const path = require('path');

const credentialsPath = path.join(__dirname, '../config/dialogflow-service-account.json');

try {
  // Check if file exists
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ File not found:', credentialsPath);
    console.log('\n💡 Make sure you have the Dialogflow service account JSON file at:');
    console.log('   config/dialogflow-service-account.json');
    process.exit(1);
  }

  // Read the JSON file
  const jsonContent = fs.readFileSync(credentialsPath, 'utf8');
  
  // Validate it's valid JSON
  try {
    JSON.parse(jsonContent);
  } catch (e) {
    console.error('❌ Invalid JSON file:', e.message);
    process.exit(1);
  }

  // Convert to Base64 (single line, no breaks)
  const base64String = Buffer.from(jsonContent).toString('base64');

  console.log('✅ Successfully encoded credentials to Base64\n');
  console.log('📋 Copy this ENTIRE string (no line breaks):');
  console.log('━'.repeat(80));
  console.log(base64String);
  console.log('━'.repeat(80));
  console.log('\n📝 Add to Render.com environment variables:');
  console.log('   Key: GOOGLE_CREDENTIALS_BASE64');
  console.log('   Value: [paste the entire string above]');
  console.log('\n⚠️  Important:');
  console.log('   • Copy the ENTIRE string (it may be very long)');
  console.log('   • Do NOT add line breaks');
  console.log('   • Do NOT add quotes');
  console.log('   • Paste directly into Render\'s value field');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
