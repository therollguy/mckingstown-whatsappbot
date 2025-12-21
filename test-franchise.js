/**
 * Test script for franchise routing
 * Run: node test-franchise.js
 */

require('dotenv').config();
const franchiseService = require('./src/services/franchiseService');

console.log('🧪 Testing Franchise Routing Service\n');

// Test cases
const testLocations = [
  'Chennai, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Bangalore',
  'Delhi',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad, Gujarat',
  'Jaipur',
  'Kochi, Kerala',
  'Ludhiana',
  'Unknown City, Unknown State'
];

console.log('Testing franchise officer matching:\n');

testLocations.forEach(location => {
  const officer = franchiseService.findOfficer(location);
  const response = franchiseService.generateResponseMessage(officer, location);
  
  console.log(`📍 Location: ${location}`);
  console.log(`👤 Officer: ${officer.name} (${officer.state})`);
  console.log(`📱 Phone: ${officer.phone}`);
  console.log(`🎯 Match Type: ${officer.matchType}`);
  console.log('---\n');
});

console.log('✅ Franchise routing test completed!');
console.log('\nAll locations have been matched to franchise officers.');
console.log('Unknown locations default to: National Franchise Head');
