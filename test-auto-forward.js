/**
 * Test auto-forwarding franchise enquiries to regional managers
 */
const axios = require('axios');

const TEST_URL = 'http://localhost:3000/webhook/test';
const sessionId = 'franchise-forward-test-' + Date.now();

async function sendMessage(message, stepName) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📤 ${stepName}`);
  console.log(`💬 User: "${message}"`);
  console.log(`${'='.repeat(70)}`);

  try {
    const response = await axios.post(TEST_URL, {
      sessionId: sessionId,
      message: message
    });

    console.log(`\n🤖 Bot Response:`);
    console.log(response.data.reply);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

async function testAutoForwarding() {
  console.log('\n🚀 TESTING AUTO-FORWARDING FRANCHISE ENQUIRIES');
  console.log('='.repeat(70));
  console.log(`Session ID: ${sessionId}\n`);

  // Test 1: Initial greeting
  await sendMessage('hello', 'STEP 1: Initial greeting');

  // Test 2: Show interest in franchise (sets context)
  await sendMessage('franchise', 'STEP 2: Express franchise interest');

  // Test 3: Ask for contact - should AUTO-FORWARD and show confirmation
  await sendMessage('i want to contact', 'STEP 3: Request contact - AUTO-FORWARD');

  console.log('\n' + '='.repeat(70));
  console.log('📋 EXPECTED: Auto-forwarding confirmation with:');
  console.log('   ✅ "Your franchise enquiry has been forwarded!"');
  console.log('   📋 Enquiry ID');
  console.log('   👤 Regional Manager name');
  console.log('   📞 Regional Manager contact');
  console.log('   ⏰ "will contact you within 24 hours"');
  console.log('='.repeat(70));

  // Test 4: New session - test location-based auto-forwarding
  const sessionId2 = 'location-forward-test-' + Date.now();
  
  console.log('\n\n🔄 TESTING LOCATION-BASED AUTO-FORWARDING');
  console.log('='.repeat(70));
  
  await sendMessageWithSession('franchise', 'STEP 1: Express interest', sessionId2);
  await sendMessageWithSession('chennai', 'STEP 2: Mention location - AUTO-FORWARD', sessionId2);
  
  console.log('\n' + '='.repeat(70));
  console.log('📋 EXPECTED: Location-based forwarding with:');
  console.log('   ✅ "Thank you for your interest in McKingstown franchise in Chennai!"');
  console.log('   🎯 "forwarded to our Tamil Nadu regional manager"');
  console.log('   📋 Enquiry ID');
  console.log('   👤 Tamil Nadu manager details');
  console.log('='.repeat(70));
}

async function sendMessageWithSession(message, stepName, sid) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📤 ${stepName}`);
  console.log(`💬 User: "${message}"`);
  console.log(`${'='.repeat(70)}`);

  try {
    const response = await axios.post(TEST_URL, {
      sessionId: sid,
      message: message
    });

    console.log(`\n🤖 Bot Response:`);
    console.log(response.data.reply);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

testAutoForwarding();
