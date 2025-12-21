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

    // Send response back to user via Twilio
    await twilioService.sendWhatsAppMessage(
      From,
      dialogflowResponse.fulfillmentText
    );

    console.log('📤 Response sent to user');

    // Respond to Twilio with TwiML (required format)
    const twiml = new twilio.twiml.MessagingResponse();
    res.type('text/xml').send(twiml.toString());

  } catch (error) {
    console.error('❌ Error in WhatsApp webhook:', error);
    
    // Return TwiML error response to Twilio
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, I encountered an error. Please try again.');
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
