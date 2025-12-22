const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Use mock Dialogflow in dev mode (FREE testing without credentials)
const DEV_MODE = process.env.DEV_MODE === 'true';
const dialogflowService = DEV_MODE 
  ? require('../services/mockDialogflowService')
  : require('../services/dialogflowService');

const twilioService = require('../services/twilioService');
const ResponseGenerator = require('../utils/responseGenerator');
const franchiseService = require('../services/franchiseService');
const ConversationalHelper = require('../utils/conversationalHelper');
const outletsData = require('../data/outlets');
const llmService = require('../services/llmService');

/**
 * Detect date/time expressions in message
 */
function detectDateTime(message) {
  const messageLower = (message || '').toLowerCase();

  // Date patterns
  const datePatterns = [
    /\b(today|tonight|now|asap)\b/,
    /\b(tomorrow|tmrw|tommorow)\b/,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
    /\b(next (week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/,
    /\b(this (evening|afternoon|morning|week|weekend))\b/,
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}\b/i
  ];

  // Time patterns
  const timePatterns = [
    /\b\d{1,2}(:\d{2})?(\s)?(am|pm|AM|PM)\b/,
    /\b(morning|afternoon|evening|night)\b/,
    /\b\d{1,2}\s?(o'?clock)\b/
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
  
  // Check if message contains any city name
  for (const city of cities) {
    if (messageLower.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  // Common city variations
  const cityVariations = {
    'chennai': ['chennai', 'madras', 'tambaram', 'velachery', 'adyar', 'annanagar', 'anna nagar', 't nagar', 'tnagar', 'kilpauk', 'perambur', 'chrompet', 'chitlapakkam', 'pallavaram', 'pammal', 'medavakkam', 'sholinganallur', 'perungudi', 'thoraipakkam', 'porur', 'kk nagar', 'ashok nagar', 'vadapalani', 'kodambakkam', 'guindy', 'saidapet', 'mylapore', 'triplicane', 'egmore', 'royapettah', 'nungambakkam', 'valasaravakkam'],
    'bangalore': ['bangalore', 'bengaluru', 'blr'],
    'coimbatore': ['coimbatore', 'cbe'],
    'madurai': ['madurai', 'mdu'],
    'trichy': ['trichy', 'tiruchirappalli', 'trich'],
    'salem': ['salem'],
    'tirupati': ['tirupati', 'tirupathi'],
    'surat': ['surat'],
    'ahmedabad': ['ahmedabad', 'amdavad'],
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
 * POST /webhook/whatsapp
 * Receives incoming WhatsApp messages from Twilio
 */
router.post('/whatsapp', async (req, res) => {
  try {
    console.log('📩 Incoming WhatsApp message:', {
      from: req.body.From,
      body: req.body.Body,
      timestamp: new Date().toISOString()
    });

    const { From, Body, ProfileName } = req.body;

    // Validate incoming message
    if (!From || !Body) {
      console.error('❌ Missing required fields: From or Body');
      return res.status(400).send('Bad Request: Missing From or Body');
    }

    // Extract phone number (remove whatsapp: prefix)
    const userPhone = From.replace('whatsapp:', '');
    const messageText = Body.trim();

    // Send message to Dialogflow for intent detection
    console.log('🤖 Sending to Dialogflow...');
    const dialogflowResponse = await dialogflowService.detectIntent(
      userPhone,
      messageText
    );

    console.log('✅ Dialogflow response:', {
      intent: dialogflowResponse.intent,
      confidence: dialogflowResponse.confidence,
      responseText: dialogflowResponse.fulfillmentText
    });

    // Generate response based on detected intent
    const intent = dialogflowResponse.intent;
    const confidence = dialogflowResponse.confidence;
    const messageTextLower = messageText.toLowerCase();
    let replyText;

    // PRIORITY 1: Check for explicit keywords first (before Dialogflow intent processing)
    // This ensures "menu", "franchise", etc. always work regardless of Dialogflow interpretation
    
    // Check for menu keyword
    if (messageTextLower.includes('menu') || messageTextLower.includes('price list') || messageTextLower.includes('all services')) {
      replyText = ResponseGenerator.getCompleteMenu();
    }
    // Check for franchise keywords
    else if (messageTextLower.match(/\b(franchise|franchisee|partner|business opportunity|investment)\b/)) {
      // Check for specific franchise sub-queries
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
      // Check if location is mentioned
      else if (messageText.match(/\b(chennai|bangalore|mumbai|delhi|hyderabad|pune|ahmedabad|surat|kolkata|jaipur|tamil nadu|karnataka|maharashtra|gujarat|kerala|andhra|telangana|rajasthan|west bengal)\b/i)) {
        const location = messageText.match(/\b(chennai|bangalore|bengaluru|mumbai|delhi|hyderabad|pune|ahmedabad|surat|kolkata|jaipur|kochi|coimbatore|madurai|vijayawada|visakhapatnam|nagpur|nashik|thiruvananthapuram|mysore|tamil nadu|karnataka|maharashtra|gujarat|kerala|andhra pradesh|andhra|telangana|rajasthan|west bengal)\b/i)[0];
        replyText = franchiseService.getLocationResponse(location);
      }
      else {
        // General franchise inquiry
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
    
    // PRIORITY 2: High confidence responses from Dialogflow for conversational intents
    // Ignore Dialogflow's Default Fallback Intent so we can continue to patterns + Gemini fallback.
    else if (intent && confidence > 0.6 && intent !== 'Default Fallback Intent') {
      const conversationalIntents = ['Welcome', 'Default Welcome Intent', 'Timing', 'Location', 
                                      'Appointment', 'Greeting', 
                                      'Thanks', 'Goodbye'];
    
      // For high-confidence conversational intents, use Dialogflow's response with enhancements
      if (conversationalIntents.includes(intent)) {
      // Use Dialogflow response but enhance if needed
      if (intent === 'Timing') {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (intent === 'Location') {
        // Check if user mentioned a specific city
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `▸ *Find Your Nearest McKingstown Outlet*

We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the closest branch.

*Major cities:* Chennai, Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai`;
        }
      }
      else if (intent === 'Appointment') {
        replyText = `▸ *Book Your Appointment*

I can help you book an appointment.

Please share:
1. Your preferred date & time
2. Your city/location

We'll confirm your booking shortly.`;
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
        // For fallback, try to understand what they're asking about
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
          // Check if user mentioned a city
          const detectedCity = detectLocation(messageText);
          if (detectedCity) {
            replyText = franchiseService.getOutletsByLocation(detectedCity);
          } else {
            replyText = `We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

*Major cities:* Chennai (70+), Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai`;
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
          replyText = `I'm here to help you with:

▸ Service prices and information
▸ Booking appointments
▸ Finding nearest outlets
▸ Franchise opportunities

Please let me know what you're looking for, or type *"menu"* to see all services.`;
        }
      }
      else {
        // Use Dialogflow's natural response
        replyText = dialogflowResponse.fulfillmentText || `How can I assist you with McKingstown services today?`;
      }
      }
    }
    
    // PRIORITY 3: Enhanced fallback with natural language understanding
    else {
      if (messageTextLower.match(/\b(cut|haircut|hair|style|mullet|fade|taper|champ)\b/)) {
        replyText = ResponseGenerator.getHaircutServices();
      }
      else if (messageTextLower.match(/\b(beard|mustache|moustache|shave|trim|facial hair|zero trim)\b/)) {
        replyText = ResponseGenerator.getBeardServices();
      }
      else if (messageTextLower.match(/\b(facial|face|skin|clean up|glow|radiance)\b/)) {
        replyText = ResponseGenerator.getFacialServices();
      }
      else if (messageTextLower.match(/\b(spa|scalp|treatment|dandruff|hair fall|nourish|detox)\b/)) {
        replyText = ResponseGenerator.getHairSpaServices();
      }
      else if (messageTextLower.match(/\b(color|colour|dye|highlight|streak|tint)\b/)) {
        replyText = ResponseGenerator.getColorServices();
      }
      else if (messageTextLower.match(/\b(wedding|marriage|groom|bride|special occasion|ceremony)\b/)) {
        replyText = ResponseGenerator.getWeddingPackages();
      }
      else if (messageTextLower.match(/\b(massage|oil|head massage|relaxation|stress)\b/)) {
        replyText = ResponseGenerator.getMassageServices();
      }
      else if (messageTextLower.match(/\b(makeup|make up|event|party|occasion|styling)\b/)) {
        replyText = ResponseGenerator.getGroomServices();
      }
      else if (messageTextLower.match(/\b(time|timing|hour|open|close|schedule|available)\b/)) {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (messageTextLower.match(/\b(price|cost|charge|expensive|cheap|affordable|rate)\b/)) {
        replyText = `I can help you with pricing information.

Our services start from:
  ➤ Haircut - ₹75
  ➤ Beard Trim - ₹40
  ➤ Facials - ₹300
  ➤ Hair Spa - ₹400
  ➤ Wedding Packages - ₹2,999

Type *"menu"* for complete price list or name a specific service you're interested in.`;
      }      // Check for appointment context (date/time provided)
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
      }      else if (messageTextLower.match(/\b(where|location|address|near|nearby|outlet|branch|shop)\b/)) {
        // Check if user mentioned a city
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

*Present in:* Chennai (70+), Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai & more!`;
        }
      }
      else if (messageTextLower.match(/\b(thank|thanks|appreciate|good|great|nice|awesome)\b/)) {
        replyText = `You're welcome. Happy to help.

Is there anything else you'd like to know about our services, appointments, or franchise opportunities?

Type *"menu"* to see all our services.`;
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
      // Check for nearest/location queries
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
      // PRIORITY 4: Final fallback
      else {
        // Check if city/location mentioned
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          // Gemini fallback (only if enabled) otherwise generic help
          if (llmService.shouldUseLLM(messageText)) {
            try {
              replyText = await llmService.getIntelligentResponse(messageText);
            } catch (error) {
              console.error('Gemini fallback error:', error.message);
              replyText = null;
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


    // Send response back to user
    const DEV_MODE = process.env.DEV_MODE === 'true';
    
    if (DEV_MODE) {
      // Development mode - just log response (FREE, no Twilio costs)
      console.log('🧪 DEV MODE - Response (not sent via Twilio):');
      console.log('─'.repeat(60));
      console.log(replyText);
      console.log('─'.repeat(60));
    } else {
      // Production mode - send via Twilio
      await twilioService.sendWhatsAppMessage(
        From,
        replyText
      );
      console.log('📤 Response sent to user');
    }

    // Respond to Twilio with TwiML (required format)
    const twiml = new twilio.twiml.MessagingResponse();
    res.type('text/xml').send(twiml.toString());

  } catch (error) {
    console.error('❌ Error in WhatsApp webhook:', error);
    
    // Send error message via REST API
    try {
      await twilioService.sendWhatsAppMessage(
        req.body.From,
        'Sorry, I encountered an error. Please try again later.'
      );
    } catch (sendError) {
      console.error('Failed to send error message:', sendError);
    }
    
    // Return empty TwiML (we already sent via REST API)
    const twiml = new twilio.twiml.MessagingResponse();
    res.type('text/xml').send(twiml.toString());
  }
});

/**
 * GET /webhook/whatsapp
 * Optional: For webhook verification (if needed)
 */
router.get('/whatsapp', (req, res) => {
  res.status(200).send('WhatsApp webhook is active');
});

module.exports = router;
