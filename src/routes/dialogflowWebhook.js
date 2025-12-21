const express = require('express');
const router = express.Router();
const franchiseService = require('../services/franchiseService');
const sheetsService = require('../services/sheetsService');

/**
 * POST /webhook/dialogflow
 * Webhook for Dialogflow fulfillment
 * Handles franchise routing and dynamic responses
 */
router.post('/dialogflow', async (req, res) => {
  try {
    const { queryResult, session } = req.body;
    
    if (!queryResult) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const intentName = queryResult.intent.displayName;
    const parameters = queryResult.parameters;
    const queryText = queryResult.queryText;

    console.log('🎯 Dialogflow webhook called:', {
      intent: intentName,
      parameters,
      queryText
    });

    let fulfillmentText = '';
    let saveToSheets = false;
    let leadData = {};

    // Handle different intents
    switch (intentName) {
      case 'business.franchise.inquiry - location':
        // Extract location from parameters
        const city = parameters['geo-city'] || '';
        const state = parameters['geo-state'] || '';
        const location = `${city}, ${state}`.trim().replace(/^,|,$/g, '').trim() || parameters.location || queryText;

        // Find franchise officer
        const officer = franchiseService.findOfficer(location);
        
        // Generate response
        fulfillmentText = franchiseService.generateResponseMessage(officer, location);

        // Prepare lead data for sheets
        saveToSheets = true;
        leadData = {
          phone: extractPhoneFromSession(session),
          city: city || 'Unknown',
          state: state || 'Unknown',
          location: location,
          officerAssigned: officer ? officer.name : 'None',
          source: 'WhatsApp Chatbot'
        };

        break;

      case 'customer.service.haircut.price':
        // You can customize prices dynamically here
        fulfillmentText = `Our haircut prices are:

✂️ **Standard Haircut**: ₹250
✂️ **Premium Haircut**: ₹400
✂️ **Kids Haircut**: ₹150

Prices may vary slightly by location. Would you like to know about other services?`;
        break;

      case 'customer.service.beard':
        fulfillmentText = `Our beard services:

🧔 **Beard Trim**: ₹150
🧔 **Beard Styling**: ₹200
🧔 **Beard Color**: ₹300
🧔 **Full Beard Grooming**: ₹350

Would you like to book an appointment?`;
        break;

      case 'customer.service.facial':
        fulfillmentText = `Our facial services:

✨ **Basic Facial**: ₹400
✨ **Deep Cleansing Facial**: ₹600
✨ **Anti-Aging Facial**: ₹800
✨ **Gold Facial**: ₹1200

All facials include complimentary head massage. Interested in booking?`;
        break;

      default:
        // For other intents, use Dialogflow's default response
        fulfillmentText = queryResult.fulfillmentText;
    }

    // Save lead to Google Sheets (async, don't wait)
    if (saveToSheets && leadData.phone) {
      sheetsService.saveFranchiseLead(leadData).catch(err => {
        console.error('Failed to save lead:', err);
      });
    }

    // Send response back to Dialogflow
    res.json({
      fulfillmentText: fulfillmentText,
      source: 'webhook'
    });

    console.log('✅ Webhook response sent');

  } catch (error) {
    console.error('❌ Dialogflow webhook error:', error);
    
    res.json({
      fulfillmentText: 'Sorry, I encountered an error. Please try again.',
      source: 'webhook-error'
    });
  }
});

/**
 * Extract phone number from Dialogflow session ID
 * Session format: projects/.../agent/sessions/{phone_number}
 */
function extractPhoneFromSession(session) {
  try {
    const parts = session.split('/');
    return parts[parts.length - 1] || 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

module.exports = router;
