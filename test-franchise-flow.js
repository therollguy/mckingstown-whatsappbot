/**
 * Test franchise conversation flow with context awareness
 */
const axios = require('axios');

const TEST_URL = 'http://localhost:3000/webhook/test';
const sessionId = 'test-session-' + Date.now();

async function sendMessage(message, stepName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📤 ${stepName}`);
  console.log(`💬 User: "${message}"`);
  console.log(`${'='.repeat(60)}`);

  try {
    const response = await axios.post(TEST_URL, {
      sessionId: sessionId,
      message: message
    });

    console.log(`\n🤖 Bot Response:`);
    console.log(response.data.reply);
    
    // Give a moment for context to be set
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testFranchiseFlow() {
  console.log('🧪 TESTING FRANCHISE CONVERSATION FLOW');
  console.log('=' .repeat(60));
  console.log(`Session ID: ${sessionId}\n`);

  // Test 1: Initial greeting (no context)
  await sendMessage('hello', 'STEP 1: Initial greeting');

  // Test 2: Express franchise interest (should set franchise context)
  await sendMessage('franchise', 'STEP 2: Express franchise interest');

  // Test 3: Ask for support (should show franchise support because context is set)
  await sendMessage('support', 'STEP 3: Ask for support in franchise context');

  // Test 4: Ask to contact (should show franchise contact details)
  await sendMessage('i want to contact officers', 'STEP 4: Request contact in franchise context');

  // Test 5: Mention location (should show regional franchise manager)
  await sendMessage('chennai', 'STEP 5: Mention location in franchise context');

  console.log('\n' + '='.repeat(60));
  console.log('✅ TEST COMPLETED');
  console.log('='.repeat(60));
  console.log('\n📋 EXPECTED RESULTS:');
  console.log('  1. Welcome message with choice (1=services, 2=franchise)');
  console.log('  2. Franchise overview with investment details');
  console.log('  3. Franchise SUPPORT details (not generic support)');
  console.log('  4. Franchise CONTACT details with regional manager option');
  console.log('  5. Tamil Nadu regional manager for Chennai location');
  console.log('\n🔍 VERIFY: All responses should be franchise-specific after step 2');
}

testFranchiseFlow();
