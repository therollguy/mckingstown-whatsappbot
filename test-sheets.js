/**
 * Test script for Google Sheets integration
 * Run: node test-sheets.js
 */

require('dotenv').config();
const sheetsService = require('./src/services/sheetsService');

async function testSheetsIntegration() {
  console.log('🧪 Testing Google Sheets Integration\n');

  // Test franchise lead
  console.log('1. Testing franchise lead save...');
  const franchiseLead = {
    name: 'Test User',
    phone: '+919876543210',
    city: 'Chennai',
    state: 'Tamil Nadu',
    location: 'Chennai, Tamil Nadu',
    officerAssigned: 'Rajesh Kumar',
    source: 'Test Script'
  };

  try {
    const result1 = await sheetsService.saveFranchiseLead(franchiseLead);
    console.log('✅ Franchise lead saved:', result1);
  } catch (error) {
    console.error('❌ Failed to save franchise lead:', error.message);
  }

  console.log('');

  // Test customer inquiry
  console.log('2. Testing customer inquiry save...');
  const customerInquiry = {
    name: 'Test User',
    phone: '+919876543210',
    intentName: 'customer.service.haircut.price',
    queryText: 'What is haircut price?',
    response: 'Our haircut prices are: Standard ₹250...',
    confidence: 0.95
  };

  try {
    const result2 = await sheetsService.saveCustomerInquiry(customerInquiry);
    console.log('✅ Customer inquiry saved:', result2);
  } catch (error) {
    console.error('❌ Failed to save customer inquiry:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('If you see "google_sheets" method, data was saved to Google Sheets ✅');
  console.log('If you see "local_file" method, data was saved locally (fallback) ⚠️');
  console.log('\nCheck:');
  console.log('- Google Sheet (if configured)');
  console.log('- data/franchise_leads.json');
  console.log('- data/customer_inquiries.json');
}

testSheetsIntegration();
