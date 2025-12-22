const express = require('express');
const router = express.Router();
const dialogflowService = require('../services/dialogflowService');
const ResponseGenerator = require('../utils/responseGenerator');
const franchiseService = require('../services/franchiseService');
const outletsData = require('../data/outlets');

/**
 * Detect city/location in message
 */
function detectLocation(message) {
  const cities = outletsData.getAllCities();
  const messageLower = message.toLowerCase();
  
  for (const city of cities) {
    if (messageLower.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  const cityVariations = {
    'chennai': ['chennai', 'madras'],
    'bangalore': ['bangalore', 'bengaluru'],
    'coimbatore': ['coimbatore', 'cbe'],
    'madurai': ['madurai'],
    'trichy': ['trichy', 'tiruchirappalli'],
    'salem': ['salem'],
    'tirupati': ['tirupati'],
    'surat': ['surat'],
    'ahmedabad': ['ahmedabad'],
    'dubai': ['dubai', 'uae']
  };
  
  for (const [city, variations] of Object.entries(cityVariations)) {
    for (const variation of variations) {
      if (messageLower.includes(variation)) {
        return city;
      }
    }
  }
  
  return null;
}

/**
 * POST /webhook/test
 * FREE local testing endpoint - simulates WhatsApp messages without Twilio
 */
router.post('/test', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use sessionId or create one for testing
    const testSessionId = sessionId || `test-user-${Date.now()}`;
    const messageText = message.trim();
    const messageTextLower = messageText.toLowerCase();

    console.log('🧪 TEST MESSAGE:', {
      sessionId: testSessionId,
      message: messageText,
      timestamp: new Date().toISOString()
    });

    // Send to Dialogflow for intent detection (if available, otherwise mock)
    let dialogflowResponse;
    try {
      dialogflowResponse = await dialogflowService.detectIntent(
        testSessionId,
        messageText
      );
    } catch (error) {
      console.log('📝 Dialogflow unavailable, using mock response');
      dialogflowResponse = {
        intent: 'Default Fallback Intent',
        confidence: 0.5,
        fulfillmentText: 'Mock response'
      };
    }

    // Use the same routing logic as real webhook
    const intent = dialogflowResponse.intent;
    const confidence = dialogflowResponse.confidence;
    let replyText;

    // PRIORITY 1: Check for explicit keywords first
    if (messageTextLower.includes('menu') || messageTextLower.includes('price list') || messageTextLower.includes('all services')) {
      replyText = ResponseGenerator.getCompleteMenu();
    }
    // Check for franchise keywords
    else if (messageTextLower.match(/\b(franchise|franchisee|partner|business opportunity|investment)\b/)) {
      if (messageTextLower.match(/\b(investment|cost|breakup|money|capital|fund)\b/)) {
        replyText = franchiseService.getInvestmentDetails();
      }
      else if (messageTextLower.match(/\b(revenue|profit|roi|return|earn|income)\b/)) {
        replyText = franchiseService.getRevenueProjections();
      }
      else if (messageTextLower.match(/\b(support|help|training|assistance)\b/)) {
        replyText = franchiseService.getSupportDetails();
      }
      else if (messageTextLower.match(/\b(contact|call|phone|number|reach)\b/)) {
        replyText = franchiseService.getContactDetails();
      }
      else if (messageText.match(/\b(chennai|bangalore|mumbai|delhi|hyderabad|pune|ahmedabad|surat|kolkata|jaipur|tamil nadu|karnataka|maharashtra|gujarat|kerala|andhra|telangana|rajasthan|west bengal)\b/i)) {
        const location = messageText.match(/\b(chennai|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|ahmedabad|surat|kolkata|jaipur|kochi|coimbatore|madurai|vijayawada|visakhapatnam|nagpur|nashik|thiruvananthapuram|mysore|tamil nadu|karnataka|maharashtra|gujarat|kerala|andhra pradesh|andhra|telangana|rajasthan|west bengal)\b/i)[0];
        replyText = franchiseService.getLocationResponse(location);
      }
      else {
        replyText = franchiseService.getOverview();
      }
    }
    // Check for specific service keywords
    else if (messageTextLower.match(/\b(haircut|hair cut|cut|hairstyle)\b/)) {
      replyText = ResponseGenerator.getHaircutServices();
    }
    else if (messageTextLower.match(/\b(beard|mustache|moustache|shave|trim)\b/)) {
      replyText = ResponseGenerator.getBeardServices();
    }
    else if (messageTextLower.match(/\b(facial|face care|skin care|cleanup|clean up)\b/)) {
      replyText = ResponseGenerator.getFacialServices();
    }
    else if (messageTextLower.match(/\b(spa|hair spa|scalp treatment)\b/)) {
      replyText = ResponseGenerator.getHairSpaServices();
    }
    else if (messageTextLower.match(/\b(color|colour|dye|highlight|streak)\b/)) {
      replyText = ResponseGenerator.getColorServices();
    }
    else if (messageTextLower.match(/\b(wedding|marriage|groom package|bridal)\b/)) {
      replyText = ResponseGenerator.getWeddingPackages();
    }
    else if (messageTextLower.match(/\b(massage|head massage|oil massage)\b/)) {
      replyText = ResponseGenerator.getMassageServices();
    }
    else if (messageTextLower.match(/\b(makeup|grooming|event styling)\b/)) {
      replyText = ResponseGenerator.getGroomServices();
    }
    else if (messageTextLower.match(/\b(book|appointment|booking|schedule|reserve)\b/)) {
      replyText = `▸ *Book Your Appointment*

I can help you book an appointment.

Please share:
1. Your preferred date & time
2. Your city/location

We'll confirm your booking shortly.`;
    }
    // PRIORITY 2: High confidence Dialogflow intents
    else if (intent && confidence > 0.6) {
      if (intent === 'Timing') {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (intent === 'Location') {
        replyText = `▸ *Find Your Nearest McKingstown Outlet*

We have 100+ outlets across India.

Please share your city name, and I'll help you find the closest branch.`;
      }
      else if (intent.includes('Welcome') || intent === 'Greeting') {
        replyText = `▸ *Welcome to McKingstown Men's Salon*

India's Premier Grooming Destination
*100+ Outlets | Now in Dubai*

▸ *For Customers:*
  ➤ Type *"haircut"* - Haircut prices (₹75+)
  ➤ Type *"beard"* - Beard services (₹40+)
  ➤ Type *"facial"* - Facial services (₹300+)
  ➤ Type *"menu"* - Complete price list
  ➤ Type *"book"* - Book appointment

▸ *For Business Partners:*
  ➤ Type *"franchise"* - Investment opportunity (₹19L)

▸ 10+ years experience | Premium quality at affordable prices

How can I assist you today?`;
      }
      else if (intent === 'Default Fallback Intent') {
        if (messageTextLower.match(/\b(price|cost|charge|rate|how much)\b/)) {
          replyText = `I can help you with pricing information.

Type:
  ➤ *"haircut"* for haircut prices
  ➤ *"beard"* for beard service prices
  ➤ *"facial"* for facial prices
  ➤ *"menu"* for complete price list

What service are you interested in?`;
        }
        else if (messageTextLower.match(/\b(where|location|address|near|nearby|outlet)\b/)) {
          replyText = `We have 100+ outlets across India.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

Major cities: Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Surat, and more.`;
        }
        else if (messageTextLower.match(/\b(thank|thanks|appreciate)\b/)) {
          replyText = `You're welcome. Happy to help.

Is there anything else you'd like to know about our services or franchise opportunities?`;
        }
        else if (messageTextLower.match(/\b(bye|goodbye|see you|later)\b/)) {
          replyText = `Thank you for choosing McKingstown. Have a great day.

Feel free to reach out anytime for grooming services or appointments.

Visit us at: www.mckingstown.com`;
        }
        else {
          replyText = `I'm here to help you with:

▸ Service prices and information
▸ Booking appointments
▸ Finding nearest outlets
▸ Franchise opportunities

Please let me know what you're looking for, or type *"menu"* to see all services.`;
        }
      }
      else {
        replyText = dialogflowResponse.fulfillmentText || `How can I assist you with McKingstown services today?`;
      }
    }
    // PRIORITY 3: Natural language fallback
    else {
      if (messageTextLower.match(/\b(price|cost|charge|expensive|cheap|affordable|rate|how much)\b/)) {
        replyText = `I can help you with pricing information.

Our services start from:
  ➤ Haircut - ₹75
  ➤ Beard Trim - ₹40
  ➤ Facials - ₹300
  ➤ Hair Spa - ₹400
  ➤ Wedding Packages - ₹2,999

Type *"menu"* for complete price list or specify which service you're interested in.`;
      }
      else if (messageTextLower.match(/\b(where|location|address|near|nearby|outlet|branch|shop|find)\b/)) {
        replyText = `We have 100+ outlets across India.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

We're present in: Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Surat, Coimbatore, and many more cities.`;
      }
      else if (messageTextLower.match(/\b(time|timing|hour|open|close|schedule|available|when)\b/)) {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (messageTextLower.match(/\b(thank|thanks|appreciate|good|great|nice|awesome|perfect)\b/)) {
        replyText = `You're welcome. Happy to help.

Is there anything else you'd like to know about our services, appointments, or franchise opportunities?

Type *"menu"* to see all services.`;
      }
      else if (messageTextLower.match(/\b(bye|goodbye|see you|later|done|thats all|that's all)\b/)) {
        replyText = `Thank you for choosing McKingstown. Have a great day.

Feel free to reach out anytime for grooming services or to book an appointment.

Visit us: www.mckingstown.com`;
      }
      else if (messageTextLower.match(/\b(help|assist|support|guide)\b/)) {
        replyText = `I'm here to assist you with McKingstown services.

You can ask me about:
  ➤ Service prices (haircut, beard, facial, spa, color)
  ➤ Booking appointments
  ➤ Finding outlets near you
  ➤ Opening hours
  ➤ Franchise opportunities

Just ask naturally, and I'll help you find what you need.`;
      }
      else {
        replyText = `I'm here to help you with McKingstown Men's Salon.

You can ask me things like:
  "What's the price for a haircut?"
  "When are you open?"
  "Where's the nearest outlet?"
  "I want to book an appointment"
  "Tell me about franchise opportunities"

Or type *"menu"* for complete service list. How can I assist you?`;
      }
    }

    // Return response
    res.json({
      success: true,
      message: messageText,
      response: replyText,
      debug: {
        intent: intent,
        confidence: confidence,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in test webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /webhook/test
 * Test interface status
 */
router.get('/test', (req, res) => {
  res.json({
    status: 'active',
    message: 'FREE local testing endpoint - No Twilio costs!',
    usage: {
      method: 'POST',
      endpoint: '/webhook/test',
      body: {
        message: 'Your test message here',
        sessionId: 'optional-session-id'
      }
    },
    examples: [
      { message: 'menu' },
      { message: 'franchise' },
      { message: 'what is the price for haircut?' },
      { message: 'i want to start a franchise' }
    ]
  });
});

module.exports = router;
