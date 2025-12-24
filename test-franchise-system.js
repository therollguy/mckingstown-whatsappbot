/**
 * Test Script - Franchise Lead System
 * Tests lead creation, forwarding logic, and dashboard functionality
 */

const franchiseForwardingService = require('./src/services/franchiseForwardingService');
const leadDashboardService = require('./src/services/leadDashboardService');
const { getAdvisorByLocation, hasActiveAdvisors } = require('./src/data/regionalAdvisors');

console.log('🧪 Testing Franchise Lead System\n');
console.log('='.repeat(60));

// Test 1: Regional Advisor Detection
console.log('\n📍 Test 1: Regional Advisor Detection\n');

const testLocations = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Dubai',
  'Unknown City'
];

testLocations.forEach(location => {
  const advisor = getAdvisorByLocation(location);
  if (advisor) {
    console.log(`✅ ${location} → ${advisor.name} (${advisor.region})`);
  } else {
    console.log(`⚠️  ${location} → No advisor found`);
  }
});

// Test 2: Check if advisors are configured
console.log('\n⚙️  Test 2: Advisor Configuration Status\n');

const hasAdvisors = hasActiveAdvisors();
console.log(`Active advisors configured: ${hasAdvisors ? 'YES ✅' : 'NO ⚠️ (Will log leads only)'}`);

if (!hasAdvisors) {
  console.log('\n💡 To enable forwarding:');
  console.log('   1. Edit: src/data/regionalAdvisors.js');
  console.log('   2. Set whatsappNumber for each region');
  console.log('   3. Set active: true');
  console.log('   4. Follow FRANCHISE_SYSTEM_SETUP.md guide\n');
}

// Test 3: Enquiry Type Detection
console.log('\n🔍 Test 3: Enquiry Type Detection\n');

const testMessages = [
  'How much investment is required for franchise?',
  'What is the revenue model?',
  'Do you provide training and support?',
  'I want franchise in Chennai',
  'Tell me about franchise opportunity'
];

testMessages.forEach(message => {
  const enquiryType = franchiseForwardingService.extractEnquiryType(message);
  console.log(`📝 "${message.substring(0, 40)}..." → ${enquiryType}`);
});

// Test 4: Location Detection
console.log('\n🌍 Test 4: Location Detection from Message\n');

const testMessageLocations = [
  'I want franchise in Chennai',
  'Interested in Mumbai location',
  'Looking for franchise opportunity in Tamil Nadu',
  'Franchise details'
];

testMessageLocations.forEach(message => {
  const location = franchiseForwardingService.detectLocationFromMessage(message);
  console.log(`📍 "${message}" → ${location || 'Not specified'}`);
});

// Test 5: Lead Message Formatting
console.log('\n📄 Test 5: Lead Message Format Preview\n');

const sampleLead = {
  id: 'LEAD-1703427123456-abc123def',
  customerPhone: '+919876543210',
  customerName: 'Ravi Kumar',
  location: 'Chennai',
  enquiryType: 'investment',
  enquiryMessage: 'I want to know about franchise investment in Chennai area',
  interestedIn: ['Franchise Opportunity'],
  createdAt: new Date().toISOString()
};

const formattedMessage = franchiseForwardingService.formatLeadMessage(sampleLead);
console.log('Message that will be sent to regional advisor:');
console.log('\n' + '-'.repeat(60));
console.log(formattedMessage);
console.log('-'.repeat(60));

// Test 6: Create Test Lead (Optional - will actually create a lead)
console.log('\n💾 Test 6: Create Sample Lead (Simulation)\n');

async function testLeadCreation() {
  try {
    console.log('Creating test lead...');
    
    const testLead = await leadDashboardService.createLead({
      customerPhone: '+919999999999',
      customerName: 'Test Customer',
      location: 'Chennai',
      enquiryType: 'investment',
      enquiryMessage: 'This is a test franchise enquiry',
      interestedIn: ['Franchise Opportunity']
    });
    
    console.log(`✅ Test lead created: ${testLead.id}`);
    console.log(`   Phone: ${testLead.customerPhone}`);
    console.log(`   Location: ${testLead.location}`);
    console.log(`   Status: ${testLead.status}`);
    
    // Get summary
    const summary = await leadDashboardService.getLeadsSummary();
    console.log(`\n📊 Dashboard Summary:`);
    console.log(`   Total leads: ${summary.total}`);
    console.log(`   Today: ${summary.todayCount}`);
    console.log(`   This week: ${summary.weekCount}`);
    
    return testLead.id;
  } catch (error) {
    console.error('❌ Error creating test lead:', error.message);
    return null;
  }
}

// Test 7: Dashboard Statistics
async function testDashboard() {
  console.log('\n📊 Test 7: Dashboard Statistics\n');
  
  try {
    const summary = await leadDashboardService.getLeadsSummary();
    
    console.log(`Total Leads: ${summary.total}`);
    console.log(`Today: ${summary.todayCount}`);
    console.log(`This Week: ${summary.weekCount}`);
    console.log(`This Month: ${summary.monthCount}`);
    
    console.log(`\nBy Status:`);
    Object.entries(summary.byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
    if (summary.byLocation && Object.keys(summary.byLocation).length > 0) {
      console.log(`\nTop Locations:`);
      Object.entries(summary.byLocation)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([location, count]) => {
          console.log(`  ${location}: ${count}`);
        });
    }
  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error.message);
  }
}

// Run async tests
(async () => {
  // Create a test lead
  const leadId = await testLeadCreation();
  
  // Show dashboard stats
  await testDashboard();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Franchise Lead System Test Complete!\n');
  console.log('Next Steps:');
  console.log('  1. Configure regional advisors in src/data/regionalAdvisors.js');
  console.log('  2. Access dashboard: http://localhost:3000/dashboard');
  console.log('  3. Test with real franchise query via WhatsApp');
  console.log('  4. Follow FRANCHISE_SYSTEM_SETUP.md for full guide\n');
  
  if (leadId) {
    console.log(`💡 Test lead created with ID: ${leadId}`);
    console.log(`   View it in dashboard after starting server\n`);
  }
})();
