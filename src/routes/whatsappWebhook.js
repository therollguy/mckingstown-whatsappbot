const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const dialogflowService = require('../services/dialogflowService');
const twilioService = require('../services/twilioService');

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
    let replyText;

    if (intent === 'Service_Pricing' || intent === 'Haircut_Price' || intent === 'Beard_Service' || intent === 'Facial_Service') {
      replyText = `💈 *McKingstown Services & Prices*

🔸 Haircut: ₹199
🔸 Beard Trim: ₹99
🔸 Facial: ₹299
🔸 Haircut + Beard Combo: ₹249

📍 Available at 100+ outlets across India!

Would you like to book an appointment or find your nearest outlet? 😊`;
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
    else if (intent === 'Appointment') {
      replyText = `📅 *Book Your Appointment*

Great! I can help you book an appointment.

Please share:
1️⃣ Your preferred date & time
2️⃣ Your city/location

Or call our hotline: 📞 1800-XXX-XXXX`;
    }
    else if (intent === 'Franchise_Inquiry') {
      replyText = `🤝 *McKingstown Franchise Opportunity*

Thank you for your interest in partnering with us!

To help you better, please share your:
📍 State/City where you want to open the franchise

Our franchise team will get in touch with you shortly! 🎯`;
    }
    else if (intent === 'Welcome' || intent === 'Default Welcome Intent') {
      replyText = `👋 *Welcome to McKingstown!*

India's #1 Barbershop Chain with 100+ outlets! 💈

How can I help you today?

🔸 View Services & Prices
🔸 Book Appointment
🔸 Find Nearest Outlet
🔸 Franchise Inquiry

Just type what you need! 😊`;
    }
    else {
      // Fallback for unknown intents
      replyText = `Sorry, I didn't quite understand that. 😅

I can help you with:
• Service prices
• Booking appointments
• Finding outlets near you
• Franchise inquiries

Please type what you need!`;
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
