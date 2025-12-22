/**
 * Local Test Harness - Test webhook WITHOUT Twilio costs
 * Run: node test/local-test.js
 */

const axios = require('axios');

// Your local or deployed webhook URL
// NOTE: `/webhook/whatsapp` is a Twilio endpoint that returns TwiML (often `<Response/>`).
// For FREE local testing and readable output, use `/webhook/test` (JSON) by default.
const WEBHOOK_URL = process.env.TEST_WEBHOOK_URL || 'http://localhost:10000/webhook/test';
// Examples:
//   $env:TEST_WEBHOOK_URL='http://localhost:10000/webhook/test'; npm test
//   $env:TEST_WEBHOOK_URL='https://your-app.onrender.com/webhook/test'; npm test

// Test messages
const testMessages = [
  'hi',
  'menu',
  'franchise',
  'i want to start a franchise',
  'what is the price?',
  'haircut',
  'beard',
  'facial',
  'book',
  'when are you open?',
  'where is nearest outlet?',
  'thanks',
  // Unknown / conversational messages to verify Gemini fallback path
  'Are you an AI model?',
  'Tell me a joke',
  'What is blockchain?'
];

async function testMessage(message) {
  try {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📩 Testing: "${message}"`);
    console.log('═'.repeat(60));
    
    const response = await axios.post(
      WEBHOOK_URL,
      {
        message,
        sessionId: 'local-test',
        from: 'whatsapp:+919876543210',
        profileName: 'Test User'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Response Status:', response.status);
    if (response.data && typeof response.data === 'object') {
      console.log('🤖 Bot:', response.data.response || '(no response field)');
      if (response.data.debug) {
        console.log('🧭 Debug:', JSON.stringify(response.data.debug));
      }
    } else {
      console.log('📤 Response:', response.data);
    }
    
    // Wait 2 seconds between tests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function runTests() {
  console.log('🧪 Starting Local Webhook Tests');
  console.log(`🎯 Target: ${WEBHOOK_URL}\n`);
  
  // Test if server is running
  try {
    // Most of our endpoints are POST-only; do a lightweight POST ping.
    await axios.post(WEBHOOK_URL, {
      // Use a deterministic keyword so we don't consume Gemini quota during availability check.
      message: 'menu',
      sessionId: 'local-test',
      from: 'whatsapp:+919876543210',
      profileName: 'Test User'
    });
    console.log('✅ Server is running\n');
  } catch (error) {
    console.error('❌ Server not reachable. Make sure your app is running!');
    console.error('   Run: npm start\n');
    return;
  }

  // Run all test messages
  for (const message of testMessages) {
    await testMessage(message);
  }

  console.log('\n\n✅ All tests completed!');
  console.log('💡 Check your terminal logs to see the bot responses');
}

// Run tests
runTests();
