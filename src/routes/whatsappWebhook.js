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
const patternMatcher = require('../utils/patternMatcher');
const franchiseForwardingService = require('../services/franchiseForwardingService');
const conversationContext = require('../utils/conversationContext');

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

    // Check pattern matcher for intent detection
    const patternResult = patternMatcher.match(messageText);
    console.log('🎯 Pattern Match:', {
      intent: patternResult.intent,
      confidence: patternResult.confidence,
      matched: patternResult.matched
    });

    // Get user conversation context
    const userContext = conversationContext.getUserContext(userPhone);
    console.log('💬 User Context:', userContext ? userContext.intent : 'none');

    // PRIORITY 0: Handle user's initial choice (services vs franchise)
    if (!userContext && (messageTextLower.includes('service') || messageTextLower === '1')) {
      conversationContext.setUserContext(userPhone, conversationContext.IntentTypes.SERVICES);
      replyText = `✅ *Great! I'll help you with our services.*

You can ask about:
  ➤ *"haircut"* - Haircut services & prices
  ➤ *"beard"* - Beard grooming
  ➤ *"facial"* - Facial treatments
  ➤ *"spa"* - Hair spa services
  ➤ *"menu"* - Complete price list
  ➤ *"book"* - Book appointment
  ➤ *"location"* - Find nearest outlet

What service are you interested in?`;
    }
    else if (!userContext && (messageTextLower.includes('franchise') || messageTextLower.includes('business') || messageTextLower === '2')) {
      conversationContext.setUserContext(userPhone, conversationContext.IntentTypes.FRANCHISE);
      replyText = franchiseService.getOverview();
    }
    // PRIORITY 1: Direct commands (menu, help) - Highest priority
    else if (messageTextLower.includes('menu') || messageTextLower.includes('price list') || messageTextLower.includes('all services')) {
      replyText = ResponseGenerator.getCompleteMenu();
    }
    // PRIORITY 1.5: Context-aware shortcuts (contact, location when user has context)
    else if (messageTextLower.match(/\b(contact|call|phone|reach)\b/) && conversationContext.isInFranchiseFlow(userPhone)) {
      // Start collecting franchise enquiry details
      conversationContext.updateUserContext(userPhone, {
        stage: conversationContext.FranchiseStages.COLLECTING_NAME,
        phone: userPhone
      });
      
      replyText = `🎯 *Great! Let me connect you with our franchise team.*\n\n` +
        `To help us serve you better, I need a few quick details:\n\n` +
        `📝 *Step 1/3:* Please share your *full name*`;
    }
    else if (detectLocation(messageText) && conversationContext.isInFranchiseFlow(userPhone) && !conversationContext.isCollectingFranchiseData(userPhone)) {
      // User mentioned location - start data collection
      const location = detectLocation(messageText);
      conversationContext.updateUserContext(userPhone, {
        stage: conversationContext.FranchiseStages.COLLECTING_NAME,
        phone: userPhone,
        preferredLocation: location
      });
      
      replyText = `🎯 *Excellent! You're interested in ${location}.*\n\n` +
        `Let me gather some details to connect you with our ${location} franchise team:\n\n` +
        `📝 *Step 1/3:* Please share your *full name*`;
    }
    // PRIORITY 1.6: Handle franchise data collection flow
    else if (conversationContext.isCollectingFranchiseData(userPhone)) {
      const context = conversationContext.getUserContext(userPhone);
      const stage = context.data.stage;
      
      if (stage === conversationContext.FranchiseStages.COLLECTING_NAME) {
        // Save name and ask for location
        conversationContext.updateUserContext(userPhone, {
          name: messageText.trim(),
          stage: conversationContext.FranchiseStages.COLLECTING_LOCATION
        });
        
        replyText = `Thank you, *${messageText.trim()}*! 👍\n\n` +
          `📝 *Step 2/3:* Which *city* are you interested in opening the franchise?`;
      }
      else if (stage === conversationContext.FranchiseStages.COLLECTING_LOCATION) {
        // Save location and ask for email
        conversationContext.updateUserContext(userPhone, {
          preferredLocation: messageText.trim(),
          stage: conversationContext.FranchiseStages.COLLECTING_EMAIL
        });
        
        replyText = `Perfect! *${messageText.trim()}* is a great location. 📍\n\n` +
          `📝 *Step 3/3:* Please share your *email address* (or type "skip" if you don't have one)`;
      }
      else if (stage === conversationContext.FranchiseStages.COLLECTING_EMAIL) {
        // Save email and ask for additional details
        const email = messageTextLower === 'skip' ? 'Not provided' : messageText.trim();
        conversationContext.updateUserContext(userPhone, {
          email: email,
          stage: conversationContext.FranchiseStages.COLLECTING_DETAILS
        });
        
        replyText = `Great! 📧\n\n` +
          `📝 *Final Step:* Any specific questions or requirements? (or type "done" to submit)`;
      }
      else if (stage === conversationContext.FranchiseStages.COLLECTING_DETAILS) {
        // Collect final details and forward enquiry
        const additionalDetails = messageTextLower === 'done' ? 'None' : messageText.trim();
        conversationContext.updateUserContext(userPhone, {
          additionalDetails: additionalDetails
        });
        
        // Forward the complete enquiry
        try {
          const enquiryData = context.data;
          
          // Validate that we have the required data
          if (!enquiryData || !enquiryData.name || !enquiryData.preferredLocation) {
            replyText = `Sorry, there was an issue with your enquiry data. Please start over by typing "franchise" and "contact" again.`;
            conversationContext.clearUserContext(userPhone);
            return;
          }
          
          const fullMessage = `Franchise Enquiry:\n` +
            `Name: ${enquiryData.name}\n` +
            `Location: ${enquiryData.preferredLocation}\n` +
            `Email: ${enquiryData.email || 'Not provided'}\n` +
            `Phone: ${enquiryData.phone || userPhone}\n` +
            `Details: ${additionalDetails}`;
          
          const result = await franchiseForwardingService.forwardFranchiseEnquiry(
            userPhone,
            fullMessage,
            enquiryData.name
          );
          
          if (result.success && result.forwarded) {
            replyText = `✅ *Perfect! Your enquiry has been submitted!*\n\n` +
              `🎯 *Your Details:*\n` +
              `👤 Name: ${enquiryData.name}\n` +
              `📍 Location: ${enquiryData.preferredLocation}\n` +
              `📧 Email: ${enquiryData.email || 'Not provided'}\n\n` +
              `📋 *Enquiry ID:* ${result.lead.id}\n` +
              `👔 *Assigned Manager:* ${result.advisor.name}\n` +
              `📞 *Manager Contact:* ${result.advisor.whatsappNumber}\n\n` +
              `⏰ Our ${result.advisor.region} franchise manager will contact you within 24 hours.\n\n` +
              `🏆 Thank you for your interest in McKingstown franchise!`;
            
            // Clear the collection context
            conversationContext.clearUserContext(userPhone);
            // Reset to franchise context
            conversationContext.setUserContext(userPhone, conversationContext.IntentTypes.FRANCHISE);
          } else {
            replyText = `✅ *Thank you! Your enquiry has been recorded.*\n\n` +
              `📋 *Reference ID:* ${result.lead.id}\n\n` +
              `Our team will review and contact you within 24-48 hours.\n\n` +
              `📞 For immediate assistance: +91 8939000150`;
            
            conversationContext.clearUserContext(userPhone);
            conversationContext.setUserContext(userPhone, conversationContext.IntentTypes.FRANCHISE);
          }
        } catch (error) {
          console.error('❌ Error submitting franchise enquiry:', error);
          replyText = `Sorry, there was an error submitting your enquiry. Please try again or call us directly at +91 8939000150`;
          conversationContext.clearUserContext(userPhone);
        }
      }
    }
    // PRIORITY 2: Pattern-based service detection (confidence > 0.5)
    else if (patternResult.confidence > 0.5) {
      const patternIntent = patternResult.intent;
      
      if (patternIntent === 'franchise') {
        // Set franchise context if not already set
        if (!conversationContext.isInFranchiseFlow(userPhone)) {
          conversationContext.setUserContext(userPhone, conversationContext.IntentTypes.FRANCHISE);
        }
        
        // Auto-forward franchise enquiry to regional advisor and log in dashboard
        try {
          console.log('🚨 Franchise enquiry detected - initiating forwarding process');
          
          // Forward enquiry in background (don't wait for it)
          franchiseForwardingService.forwardFranchiseEnquiry(
            From.replace('whatsapp:', ''),
            messageText,
            ProfileName || 'Unknown'
          ).then(result => {
            if (result.success && result.forwarded) {
              console.log(`✅ Franchise enquiry forwarded successfully. Lead ID: ${result.lead.id}`);
              // Send confirmation to customer
              franchiseForwardingService.sendCustomerConfirmation(
                From.replace('whatsapp:', ''),
                result.lead.id,
                true
              );
            } else if (result.success && !result.forwarded) {
              console.log(`📊 Franchise enquiry logged. Lead ID: ${result.lead.id}`);
              // Send acknowledgment to customer
              franchiseForwardingService.sendCustomerConfirmation(
                From.replace('whatsapp:', ''),
                result.lead.id,
                false
              );
            }
          }).catch(error => {
            console.error('❌ Error in franchise forwarding:', error);
          });
        } catch (error) {
          console.error('❌ Error initiating franchise forwarding:', error);
        }
        
        // Franchise sub-queries - provide immediate response to customer
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
        replyText = `I can help you with pricing information.

Our services start from:
  ➤ Haircut - ₹75
  ➤ Beard Trim - ₹40
  ➤ Facials - ₹300
  ➤ Hair Spa - ₹400
  ➤ Wedding Packages - ₹2,999

Type *"menu"* for complete price list or name a specific service.`;
      }
      else if (patternIntent === 'timing') {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (patternIntent === 'location') {
        const detectedCity = detectLocation(messageText);
        
        // Check if user is in franchise context
        if (conversationContext.isInFranchiseFlow(userPhone) && detectedCity) {
          // Show franchise information for that location
          replyText = franchiseService.getLocationResponse(detectedCity);
        } else if (detectedCity) {
          // Show outlets for services
          replyText = franchiseService.getOutletsByLocation(detectedCity);
        } else {
          replyText = `▸ *Find Your Nearest McKingstown Outlet*

We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the closest branch.

*Major cities:* Chennai, Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai`;
        }
      }
      else if (patternIntent === 'booking') {
        replyText = `▸ *Book Your Appointment*

I can help you book an appointment.

Please share:
1. Your preferred date & time
2. Your city/location

We'll confirm your booking shortly.`;
      }
    }
    
    // PRIORITY 3: High confidence Dialogflow responses (conversational intents)
    // Use Dialogflow for conversational patterns when confidence is high
    else if (intent && confidence > 0.7 && intent !== 'Default Fallback Intent') {
      console.log('📊 Using Dialogflow intent:', intent, 'confidence:', confidence);
      
      if (intent === 'Timing' || intent === 'Opening Hours') {
        replyText = `▸ *McKingstown Opening Hours*

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week. Need help with anything else?`;
      }
      else if (intent === 'Location' || intent === 'Find Outlet') {
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
      else if (intent === 'Appointment' || intent === 'Booking') {
        replyText = `▸ *Book Your Appointment*

I can help you book an appointment.

Please share:
1. Your preferred date & time
2. Your city/location

We'll confirm your booking shortly.`;
      }
      else if (intent.includes('Welcome') || intent === 'Greeting' || intent === 'Default Welcome Intent') {
        // Clear any previous context on new greeting
        conversationContext.clearUserContext(userPhone);
        replyText = `▸ *Welcome to McKingstown Men's Salon* 👑

India's Premier Grooming Destination
*134+ Outlets | Now in Dubai*

━━━━━━━━━━━━━━━━━━━━━━━

*How can I help you today?*

*1️⃣ SERVICES* - Haircut, Beard, Facial, Spa
   (Book appointments, prices, outlets)

*2️⃣ FRANCHISE* - Business Opportunity
   (Investment: ₹19L | ROI: 41-125%)

━━━━━━━━━━━━━━━━━━━━━━━

Please reply with:
➤ *1* or *"services"* for customer services
➤ *2* or *"franchise"* for business opportunity`;
      }
      else if (intent === 'Thanks' || intent === 'Thank You') {
        replyText = `You're welcome! Happy to help.\n\nIs there anything else you'd like to know about:\n  \u27a4 Services & pricing\n  \u27a4 Booking appointments\n  \u27a4 Outlet locations\n  \u27a4 Franchise opportunities`;
      }
      else if (intent === 'Goodbye' || intent === 'Bye') {
        replyText = `Thank you for choosing McKingstown. Have a great day!\n\nFeel free to reach out anytime for grooming services or appointments.\n\nVisit us at: www.mckingstown.com`;
      }
      else {
        // Use Dialogflow's natural response for other high-confidence intents
        replyText = dialogflowResponse.fulfillmentText || `How can I assist you with McKingstown services today?`;
      }
    }
    
    // PRIORITY 4: Enhanced pattern-based fallback with Gemini AI support
    else {
      // Try to detect intent from common patterns if pattern matcher didn't catch it
      if (messageTextLower.match(/\b(price|cost|charge|rate|how much)\b/)) {
        replyText = `I can help you with pricing information.

Type:
  \u27a4 *"haircut"* for haircut prices
  \u27a4 *"beard"* for beard service prices
  \u27a4 *"facial"* for facial prices
  \u27a4 *"menu"* for complete price list

What service are you interested in?`;
      }
      else if (messageTextLower.match(/\b(where|location|address|near|nearby|outlet)\b/)) {
        const detectedCity = detectLocation(messageText);
        
        if (detectedCity) {
          // Context-aware: franchise users get franchise info, service users get outlets
          if (conversationContext.isInFranchiseFlow(userPhone)) {
            replyText = franchiseService.getLocationResponse(detectedCity);
          } else {
            replyText = franchiseService.getOutletsByLocation(detectedCity);
          }
        } else {
          replyText = `We have ${outletsData.totalOutlets}+ outlets across India & Dubai.

Please share your city name, and I'll help you find the nearest McKingstown outlet.

*Major cities:* Chennai (70+), Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad, Dubai`;
        }
      }
      else if (detectDateTime(messageText).hasDateTime) {
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          replyText = `\u25b8 *Appointment Booking*\n\n\u2705 Date/Time: ${messageText}\n\u2705 Location: ${detectedCity}\n\nI've noted your booking request.\n\nTo confirm your appointment:\n\ud83d\udcde Please call the nearest outlet:\n\n${franchiseService.getOutletsByLocation(detectedCity)}\n\nOr share your contact number and we'll call you back.`;
        } else {
          replyText = `\u25b8 *Appointment Booking*\n\n\u2705 Date/Time: ${messageText}\n\nGreat! Now please share your city/location, and I'll help you book at the nearest outlet.\n\nExample: \"Chennai\", \"Bangalore\", \"Coimbatore\", etc.`;
        }
      }
      else if (messageTextLower.match(/\b(thank|thanks|appreciate|good|great)\b/)) {
        replyText = `You're welcome! Happy to help.\n\nIs there anything else you'd like to know about:\n  \u27a4 Services & pricing\n  \u27a4 Appointments\n  \u27a4 Outlets\n  \u27a4 Franchise opportunities`;
      }
      else if (messageTextLower.match(/\b(bye|goodbye|see you|later|done|thats all)\b/)) {
        replyText = `Thank you for choosing McKingstown. Have a great day!\n\nFeel free to reach out anytime.\n\nVisit us: www.mckingstown.com`;
      }
      else if (messageTextLower.match(/\b(contact|phone|call|reach)\b/)) {
        // Context-aware contact handling
        if (conversationContext.isInFranchiseFlow(userPhone)) {
          // User is in franchise context - show franchise contact info
          replyText = franchiseService.getContactDetails();
        } else {
          const detectedCity = detectLocation(messageText);
          if (detectedCity) {
            replyText = franchiseService.getOutletsByLocation(detectedCity);
          } else {
            replyText = `▸ *Contact McKingstown*

Share your city name to get outlet addresses & phone numbers.

For franchise: Type *"franchise"*

Which city are you in?`;
          }
        }
      }
      // PRIORITY 5: Gemini AI fallback for complex queries
      else {
        const detectedCity = detectLocation(messageText);
        if (detectedCity) {
          // User just typed a city name - respond based on context
          if (conversationContext.isInFranchiseFlow(userPhone)) {
            replyText = franchiseService.getLocationResponse(detectedCity);
          } else if (conversationContext.isInServicesFlow(userPhone)) {
            replyText = franchiseService.getOutletsByLocation(detectedCity);
          } else {
            // No context - ask what they're looking for
            replyText = `I see you're interested in ${detectedCity}.\n\nAre you looking for:\n\n*1* - Services (book appointment, find outlets)\n*2* - Franchise opportunity\n\nPlease reply 1 or 2.`;
          }
        } else if (llmService.shouldUseLLM(messageText)) {
          try {
            replyText = await llmService.getIntelligentResponse(messageText);
          } catch (error) {
            console.error('\u26a0\ufe0f Gemini fallback error:', error.message);
            replyText = null;
          }
        }

        if (!replyText) {
          // If no context, show initial choice
          if (!userContext) {
            replyText = `▸ *Welcome to McKingstown Men's Salon* 👑

India's Premier Grooming Destination
*134+ Outlets | Now in Dubai*

═══════════════════════

*How can I help you today?*

*1️⃣ SERVICES* - Haircut, Beard, Facial, Spa
   (Book appointments, prices, outlets)

*2️⃣ FRANCHISE* - Business Opportunity
   (Investment: ₹19L | ROI: 41-125%)

═══════════════════════

Please reply with:
➤ *1* or *"services"* for customer services
➤ *2* or *"franchise"* for business opportunity`;
          } else {
            replyText = `I'm here to help with McKingstown services.

You can ask about:
  ➤ Service prices (haircut, beard, facial, spa)
  ➤ Booking appointments
  ➤ Finding outlets
  ➤ Franchise opportunities

Type *"menu"* for full service list. How can I assist you?`;
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
