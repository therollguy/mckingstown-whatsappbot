/**
 * Local Test Harness - Test webhook WITHOUT Twilio costs
 * Run: node test/local-test.js
 */

const axios = require('axios');

// Your local or deployed webhook URL
const WEBHOOK_URL = 'http://localhost:10000/webhook/whatsapp';
// const WEBHOOK_URL = 'https://your-app.onrender.com/webhook/whatsapp'; // Use this for Render testing

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
  'thanks'
];

async function testMessage(message) {
  try {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📩 Testing: "${message}"`);
    console.log('═'.repeat(60));
    
    const response = await axios.post(WEBHOOK_URL, {
      From: 'whatsapp:+919876543210', // Mock phone number
      Body: message,
      ProfileName: 'Test User'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('✅ Response Status:', response.status);
    console.log('📤 Response:', response.data);
    
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
    await axios.get(WEBHOOK_URL.replace('/whatsapp', '/whatsapp'));
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
