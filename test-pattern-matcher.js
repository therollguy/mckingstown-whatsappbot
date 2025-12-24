/**
 * Test Script - Pattern Matcher Verification
 * Run this to verify the pattern matcher works correctly
 */

const patternMatcher = require('./src/utils/patternMatcher');

console.log('🧪 Testing Pattern Matcher Intelligence\n');
console.log('='.repeat(60));

// Test cases with typos, variations, and natural questions
const testCases = [
  // Typo tolerance
  { input: "how much for harcut?", expected: "haircut", description: "Typo: harcut" },
  { input: "I need a berd trim", expected: "beard", description: "Typo: berd" },
  { input: "facal treatment price", expected: "facial", description: "Typo: facal" },
  
  // Question variations
  { input: "What's the price of a haircut?", expected: "haircut", description: "Question variation" },
  { input: "How much does a beard trim cost?", expected: "beard", description: "Question variation" },
  { input: "Tell me about facial services", expected: "facial", description: "Statement variation" },
  
  // Natural language
  { input: "I want to get my hair cut", expected: "haircut", description: "Natural sentence" },
  { input: "Need a shave", expected: "beard", description: "Short query" },
  { input: "Do you offer spa treatments?", expected: "spa", description: "Question form" },
  
  // Business queries
  { input: "franchise opportunity", expected: "franchise", description: "Business query" },
  { input: "What are your opening hours?", expected: "timing", description: "Timing query" },
  { input: "Where is your nearest outlet?", expected: "location", description: "Location query" },
  { input: "I want to book an appointment", expected: "booking", description: "Booking query" },
  
  // Price queries
  { input: "How much do you charge?", expected: "price", description: "General price" },
  { input: "What's the rate for haircut?", expected: "haircut", description: "Specific price" },
  
  // Edge cases
  { input: "hair colour", expected: "color", description: "British spelling" },
  { input: "pre-wedding package", expected: "wedding", description: "Hyphenated term" },
  { input: "head massag", expected: "massage", description: "Partial typo" },
];

console.log('\nRunning Tests...\n');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = patternMatcher.match(test.input);
  const success = result.intent === test.expected && result.confidence > 0;
  
  if (success) {
    console.log(`✅ Test ${index + 1}: ${test.description}`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Intent: ${result.intent} (confidence: ${result.confidence.toFixed(2)})`);
    console.log(`   Matched: "${result.matched}"\n`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: ${test.description}`);
    console.log(`   Input: "${test.input}"`);
    console.log(`   Expected: ${test.expected}, Got: ${result.intent || 'NONE'}`);
    console.log(`   Confidence: ${result.confidence.toFixed(2)}\n`);
    failed++;
  }
});

console.log('='.repeat(60));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}/${testCases.length}`);
console.log(`   ❌ Failed: ${failed}/${testCases.length}`);
console.log(`   📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! Pattern matcher is working perfectly.\n');
} else {
  console.log('⚠️  Some tests failed. Review the pattern database in patternMatcher.js\n');
}

// Test helper methods
console.log('='.repeat(60));
console.log('\n🔍 Testing Helper Methods:\n');

const helperTests = [
  { method: 'isServiceQuery', input: 'I need a haircut', expected: true },
  { method: 'isPriceQuery', input: 'how much does it cost?', expected: true },
  { method: 'isLocationQuery', input: 'where are you located?', expected: true },
  { method: 'isBookingQuery', input: 'I want to book appointment', expected: true },
  { method: 'isFranchiseQuery', input: 'franchise opportunity', expected: true },
  { method: 'isTimingQuery', input: 'what time do you open?', expected: true },
];

helperTests.forEach((test) => {
  const result = patternMatcher[test.method](test.input);
  const success = result === test.expected;
  
  if (success) {
    console.log(`✅ ${test.method}("${test.input}") = ${result}`);
  } else {
    console.log(`❌ ${test.method}("${test.input}") = ${result} (expected: ${test.expected})`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ Pattern Matcher Test Complete!\n');
