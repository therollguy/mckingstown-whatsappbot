/**
 * Test franchise context handling
 */

const patternMatcher = require('./src/utils/patternMatcher');

console.log('🧪 Testing Franchise Context Detection\n');
console.log('='.repeat(60));

const testCases = [
  "franchise in chennai",
  "i need to create a franchise",
  "want to start franchise",
  "franchise opportunity in bangalore",
  "how to open franchise",
  "create franchise in mumbai"
];

testCases.forEach((query) => {
  const result = patternMatcher.match(query);
  console.log(`\nQuery: "${query}"`);
  console.log(`Intent: ${result.intent}`);
  console.log(`Confidence: ${result.confidence.toFixed(2)}`);
  console.log(`Matched: "${result.matched}"`);
  
  if (result.intent === 'franchise') {
    console.log('✅ Correctly detected as franchise enquiry');
  } else {
    console.log('❌ Failed to detect franchise intent');
  }
});

console.log('\n' + '='.repeat(60));
