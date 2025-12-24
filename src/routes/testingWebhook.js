const express = require('express');
const router = express.Router();
const dialogflowService = require('../services/dialogflowService');
const ResponseGenerator = require('../utils/responseGenerator');
const franchiseService = require('../services/franchiseService');
const outletsData = require('../data/outlets');
const llmService = require('../services/llmService');
const patternMatcher = require('../utils/patternMatcher');
const franchiseForwardingService = require('../services/franchiseForwardingService');

/**
 * Detect date/time expressions in message
 */
function detectDateTime(message) {
  const messageLower = message.toLowerCase();
  
  // Date patterns
  const datePatterns = [
    /\b(today|tonight|now|asap)\b/,
    /\b(tomorrow|tmrw|tommorow)\b/,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
    /\b(next (week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/,
    /\b(this (evening|afternoon|morning|week|weekend))\b/,
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/, // Date formats like 22/12/2025
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}\b/i // Dec 22
  ];
  
  // Time patterns
  const timePatterns = [
    /\b\d{1,2}(:\d{2})?(\s)?(am|pm|AM|PM)\b/, // 10am, 10:30pm
    /\b(morning|afternoon|evening|night)\b/,
    /\b\d{1,2}\s?(o'?clock)\b/ // 10 oclock
  ];
  
  const hasDate = datePatterns.some(pattern => pattern.test(messageLower));
  const hasTime = timePatterns.some(pattern => pattern.test(messageLower));
  
  return { hasDate, hasTime, hasDateTime: hasDate || hasTime };
}

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
    'chennai': ['chennai', 'madras', 'tambaram', 'velachery', 'adyar', 'annanagar', 'anna nagar', 't nagar', 'tnagar', 'kilpauk', 'perambur', 'chrompet', 'chitlapakkam', 'pallavaram', 'pammal', 'medavakkam', 'sholinganallur', 'perungudi', 'thoraipakkam', 'porur', 'kk nagar', 'ashok nagar', 'vadapalani', 'kodambakkam', 'guindy', 'saidapet', 'mylapore', 'triplicane', 'egmore', 'royapettah', 'nungambakkam', 'valasaravakkam'],
    'bangalore': ['bangalore', 'bengaluru', 'blr'],
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
    let llmDebug = null;

    // Check pattern matcher for intent detection
    const patternResult = patternMatcher.match(messageText);
    console.log('🎯 [TEST] Pattern Match:', {
      intent: patternResult.intent,
      confidence: patternResult.confidence,
      matched: patternResult.matched
    });

    // PRIORITY 1: Direct commands (menu, help)
    if (messageTextLower.includes('menu') || messageTextLower.includes('price list') || messageTextLower.includes('all services')) {
      replyText = ResponseGenerator.getCompleteMenu();
    }
    // PRIORITY 2: Pattern-based service detection (confidence > 0.5)
    else if (patternResult.confidence > 0.5) {
      const patternIntent = patternResult.intent;
      
      if (patternIntent === 'franchise') {
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
      else if (patternIntent === 'haircut') {
        replyText = ResponseGenerator.getHaircutServices();
      }
      else if (patternIntent === 'beard') {
        replyText = ResponseGenerator.getBeardServices();
      }
      else if (patternIntent === 'facial') {
        replyText = ResponseGenerator.getFacialServices();
      }
      else if (patternIntent === 'spa') {
        replyText = ResponseGenerator.getHairSpaServices();
      }
      else if (patternIntent === 'color') {
        replyText = ResponseGenerator.getColorServices();
      }
      else if (patternIntent === 'wedding') {
        replyText = ResponseGenerator.getWeddingPackages();
      }
      else if (patternIntent === 'massage') {
        replyText = ResponseGenerator.getMassageServices();
      }
      else if (patternIntent === 'price') {
        replyText = `I can help you with pricing.\n\n➤ Haircut - ₹75\n➤ Beard - ₹40\n➤ Facial - ₹300\n➤ Hair Spa - ₹400\n\nType *\"menu\"* for complete list.`;
      }
      else if (patternIntent === 'timing') {
        replyText = `▸ *Opening Hours*\n\n▸ Mon-Sat: 9 AM - 9 PM\n▸ Sunday: 10 AM - 8 PM\n\nOpen 7 days a week!`;
      }
      else if (patternIntent === 'location') {
        const detectedCity = detectLocation(messageText);
        replyText = detectedCity ? franchiseService.getOutletsByLocation(detectedCity) : `We have ${outletsData.totalOutlets}+ outlets.\n\nShare your city to find nearest outlet.\n\n*Cities:* Chennai, Bangalore, Coimbatore, Dubai & more`;
      }
      else if (patternIntent === 'booking') {
        replyText = `▸ *Book Your Appointment*\n\nShare:\n1. Date & time\n2. Your city\n\nWe'll confirm shortly.`;
      }
    }
    // PRIORITY 3: High confidence Dialogflow (conversational intents)
    else if (intent && confidence > 0.7 && intent !== 'Default Fallback Intent') {
      if (intent === 'Timing') {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (intent === 'Location') {
        // Check if a city is already mentioned in the message
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `▸ *Find Your Nearest McKingstown Outlet*

We have 100+ outlets across India.

Please share your city name, and I'll help you find the closest branch.`;
        }
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
          // Check if a city is mentioned
          const detectedCity = detectLocation(messageText);
          if (detectedCity) {
            replyText = franchiseService.getOutletsByLocation(detectedCity);
          } else {
            replyText = `We have 100+ outlets across India.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

Major cities: Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Surat, and more.`;
          }
        }
        // Check for appointment follow-up (date/time provided)
        else if (detectDateTime(messageText).hasDateTime) {
          const detectedCity = detectLocation(messageText);
          if (detectedCity) {
            replyText = `▸ *Appointment Booking*

✅ Date/Time: ${messageText}
✅ Location: ${detectedCity}

I've noted your booking request.

To confirm your appointment:
📞 Please call the nearest outlet:

${franchiseService.getOutletsByLocation(detectedCity)}

Or share your contact number and we'll call you back.`;
          } else {
            replyText = `▸ *Appointment Booking*

✅ Date/Time: ${messageText}

Great! Now please share your city/location, and I'll help you book at the nearest outlet.

Example: "Chennai", "Bangalore", "Coimbatore", etc.`;
          }
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
          // If Dialogflow couldn't match anything meaningful, try Gemini fallback (if enabled)
          if (llmService.shouldUseLLM(messageText)) {
            try {
              const llmResult = await llmService.getIntelligentResponseWithMeta(messageText);
              replyText = llmResult.text;
              llmDebug = llmResult.meta;
            } catch (error) {
              console.error('Gemini fallback error:', error.message);
              replyText = null;
              llmDebug = { attempted: true, mode: 'mock', reason: 'error', error: error.message };
            }
          }

          if (!replyText) {
            replyText = `I'm here to help you with:

▸ Service prices and information
▸ Booking appointments
▸ Finding nearest outlets
▸ Franchise opportunities

Please let me know what you're looking for, or type *"menu"* to see all services.`;
          }
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
      // Check for appointment context (date/time provided)
      else if (detectDateTime(messageText).hasDateTime) {
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = `▸ *Appointment Booking*

✅ Date/Time: ${messageText}
✅ Location: ${detectedCity}

I've noted your booking request.

To confirm your appointment:
📞 Please call the nearest outlet:

${franchiseService.getOutletsByLocation(detectedCity)}

Or share your contact number and we'll call you back.`;
        } else {
          replyText = `▸ *Appointment Booking*

✅ Date/Time: ${messageText}

Great! Now please share your city/location, and I'll help you book at the nearest outlet.

Example: "Chennai", "Bangalore", "Coimbatore", etc.`;
        }
      }
      else if (messageTextLower.match(/\b(where|location|address|near|nearby|outlet|branch|shop|find)\b/)) {
        // Check if a city is mentioned in the location query
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `We have 100+ outlets across India.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

We're present in: Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Surat, Coimbatore, and many more cities.`;
        }
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
      // Check for contact/phone queries
      else if (messageTextLower.match(/\b(contact|phone|number|call|reach|connect|talk|speak|saloon|salon)\b/)) {
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `▸ *Contact McKingstown*

To contact your nearest outlet:

1️⃣ Share your city name (e.g., "Chennai", "Bangalore")
2️⃣ I'll show you outlet addresses & phone numbers

For franchise inquiries:
Type *"franchise"* for investment details.

Which city are you in?`;
        }
      }
      // Check for nearest/location queries (catch "nearest saloon", "where", etc.)
      else if (messageTextLower.match(/\b(nearest|nearby|close|find|search|available)\b/)) {
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

*Present in:* Chennai (70+), Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai & more!`;
        }
      }
      // Check for product/quality questions
      else if (messageTextLower.match(/\b(product|products|brand|quality|use|eco|friendly|green|natural|organic)\b/)) {
        replyText = `▸ *McKingstown Quality Standards*

✅ We use *premium branded products* for all services
✅ *Hygienic practices* maintained at all outlets
✅ *Professional-grade* equipment
✅ *Trained stylists* with 10+ years experience

*Our Promise:*
Quality service at affordable prices - that's what makes us India's trusted grooming destination.

Type *"menu"* to see our services!`;
      }
      // Check for why/comparison questions
      else if (messageTextLower.match(/\b(why|difference|different|better|best|special|choose|prefer)\b/)) {
        replyText = `▸ *Why Choose McKingstown?*

➤ *Affordable Luxury* - Premium services at reasonable prices
  (Haircuts from just ₹75!)

➤ *Experience* - Over 10+ years in men's grooming

➤ *Extensive Network* - 134+ outlets for convenience
  (Chennai 70+, Bangalore, Coimbatore, Dubai & more)

➤ *Skilled Team* - Professional barbers & stylists

➤ *Quality Products* - Branded grooming products

➤ *Complete Services* - Haircut to wedding packages

We combine professional quality with affordable pricing!

Type *"menu"* to explore our services.`;
      }
      // Check for company/about questions
      else if (messageTextLower.match(/\b(company|about|who are you|tell me about|business|history|started|founded|owner)\b/)) {
        replyText = `▸ *About McKingstown*

👑 India's Premier Men's Grooming Chain

*Our Journey:*
✅ 10+ years of grooming excellence
✅ Started from single outlet to 134+ locations
✅ Present across India & Dubai
✅ Trusted by millions of customers

*Our Mission:*
Make premium grooming accessible and affordable for every man.

*Expansion:*
Growing rapidly with franchise opportunities across India.

Type *"franchise"* for business opportunities!`;
      }
      // Check for employee/staff questions
      else if (messageTextLower.match(/\b(employee|staff|barber|stylist|team|work|career|job|hiring)\b/)) {
        replyText = `▸ *McKingstown Team*

👨‍💼 *Our Professionals:*
✅ Skilled barbers & stylists at 134+ outlets
✅ Professional training provided
✅ Years of grooming expertise
✅ Customer-focused service

*Career Opportunities:*
We're always looking for talented professionals!

📞 Contact your nearest outlet for job inquiries.

Type *"chennai"* or your city to find outlets near you!`;
      }
      // PRIORITY 4: Final fallback (city detection or generic help)
      else {
        // Check if city/location mentioned
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          // Gemini fallback (only if enabled) otherwise generic help
          if (llmService.shouldUseLLM(messageText)) {
            try {
              const llmResult = await llmService.getIntelligentResponseWithMeta(messageText);
              replyText = llmResult.text;
              llmDebug = llmResult.meta;
            } catch (error) {
              console.error('Gemini fallback error:', error.message);
              replyText = null;
              llmDebug = { attempted: true, mode: 'mock', reason: 'error', error: error.message };
            }
          }

          if (!replyText) {
            replyText = `I'm here to help you with McKingstown Men's Salon.

You can ask me things like:
  "What's the price for a haircut?"
  "When are you open?"
  "Where's the nearest outlet?"
  "Why choose McKingstown?"
  "Tell me about franchise opportunities"

Or type *"menu"* for complete service list. How can I assist you?`;
          }
        }
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
        llm: llmDebug,
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
