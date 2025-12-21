const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const dialogflowService = require('../services/dialogflowService');
const twilioService = require('../services/twilioService');
const ResponseGenerator = require('../utils/responseGenerator');

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
    const messageTextLower = messageText.toLowerCase();
    let replyText;

    // Check for menu keyword
    if (messageTextLower.includes('menu') || messageTextLower.includes('price list') || messageTextLower.includes('services')) {
      replyText = ResponseGenerator.getCompleteMenu();
    }
    // Check for specific service keywords
    else if (messageTextLower.includes('haircut') || intent === 'Haircut_Price' || intent === 'Service_Pricing') {
      replyText = ResponseGenerator.getHaircutServices();
    }
    else if (messageTextLower.includes('beard') || messageTextLower.includes('shave') || intent === 'Beard_Service') {
      replyText = ResponseGenerator.getBeardServices();
    }
    else if (messageTextLower.includes('facial') || messageTextLower.includes('face') || intent === 'Facial_Service') {
      replyText = ResponseGenerator.getFacialServices();
    }
    else if (messageTextLower.includes('spa') || messageTextLower.includes('hair spa')) {
      replyText = ResponseGenerator.getHairSpaServices();
    }
    else if (messageTextLower.includes('color') || messageTextLower.includes('colour') || messageTextLower.includes('dye')) {
      replyText = ResponseGenerator.getColorServices();
    }
    else if (messageTextLower.includes('wedding') || messageTextLower.includes('package') || messageTextLower.includes('combo')) {
      replyText = ResponseGenerator.getWeddingPackages();
    }
    else if (messageTextLower.includes('massage') || messageTextLower.includes('oil')) {
      replyText = ResponseGenerator.getMassageServices();
    }
    else if (messageTextLower.includes('groom') || messageTextLower.includes('makeup') || messageTextLower.includes('styling')) {
      replyText = ResponseGenerator.getGroomServices();
    }
    else if (intent === 'Timing') {
      replyText = `⏰ *McKingstown Opening Hours*

🗓️ Monday - Saturday: 9:00 AM - 9:00 PM
🗓️ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week! Need help with anything else?`;
    }
    else if (intent === 'Location') {
      replyText = `📍 *Find Your Nearest McKingstown Outlet*

We have 100+ outlets across India!

Please share your city name, and I'll help you find the closest branch. 🏪`;
    }
    else if (intent === 'Appointment' || messageTextLower.includes('book') || messageTextLower.includes('appointment')) {
      replyText = `📅 *Book Your Appointment*

Great! I can help you book an appointment.

Please share:
1️⃣ Your preferred date & time
2️⃣ Your city/location

We'll confirm your booking shortly! 💈`;
    }
    else if (intent === 'Franchise_Inquiry' || messageTextLower.includes('franchise')) {
      replyText = `🤝 *McKingstown Franchise Opportunity*

Thank you for your interest in partnering with us!

To help you better, please share your:
📍 State/City where you want to open the franchise

Our franchise team will get in touch with you shortly! 🎯`;
    }
    else if (intent === 'Welcome' || intent === 'Default Welcome Intent' || messageTextLower.includes('hi') || messageTextLower.includes('hello')) {
      replyText = `👋 *Welcome to McKingstown Men's Salon!*

India's Premier Grooming Destination 💈

🌟 *Quick Menu:*
• Type *"haircut"* - View haircut prices
• Type *"beard"* - Beard services
• Type *"facial"* - Facial services
• Type *"spa"* - Hair spa treatments
• Type *"color"* - Hair color services
• Type *"wedding"* - Wedding packages
• Type *"menu"* - Complete price list
• Type *"book"* - Book appointment

📍 100+ outlets | Premium quality at affordable prices

What would you like today? 😊`;
    }
    else {
      // Fallback for unknown intents
      replyText = `Sorry, I didn't quite understand that. 😅

I can help you with:
💈 *Haircut* prices & styles
🧔 *Beard* services
✨ *Facial* treatments
💆 *Spa* services
🎨 *Color* services
💍 *Wedding* packages
📅 *Book* appointments
🏪 *Find* nearest outlet
🤝 *Franchise* inquiries

Type *"menu"* for complete price list!`;
    }

    // Send response back to user via Twilio
    await twilioService.sendWhatsAppMessage(
      From,
      replyText
    );

    console.log('📤 Response sent to user');

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
