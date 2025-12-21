/**
 * Test script to verify environment variables are loaded correctly
 * Run: node test-env.js
 */

require('dotenv').config();

console.log('🔍 Environment Variables Check\n');

const requiredVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_FROM',
  'DIALOGFLOW_PROJECT_ID',
  'GOOGLE_APPLICATION_CREDENTIALS'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (value.length > 50 ? value.substring(0, 30) + '...' : value) : 'NOT SET';
  
  console.log(`${status} ${varName}: ${display}`);
  
  if (!value) {
    allPresent = false;
  }
});

console.log('\n📋 Summary:');
if (allPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('\n📝 Next step: Place your Dialogflow service account JSON file at:');
  console.log(`   ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
} else {
  console.log('❌ Some environment variables are missing.');
  console.log('   Please check your .env file.');
}

console.log('\n💡 To start the server: npm start');
