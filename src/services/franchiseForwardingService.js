/**
 * Franchise Forwarding Service
 * 
 * Handles forwarding of franchise enquiries to regional advisors via WhatsApp.
 * Integrates with Twilio WhatsApp API to send messages.
 */

// Lazy-load Twilio client only when needed
let twilioClient = null;

function getTwilioClient() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
}

const { getAdvisorByLocation, hasActiveAdvisors } = require('../data/regionalAdvisors');
const leadDashboardService = require('./leadDashboardService');

/**
 * Detect location from message text
 * @param {string} message - User message
 * @returns {string|null} Detected location
 */
function detectLocationFromMessage(message) {
  const outletsData = require('../data/outlets');
  const cities = outletsData.getAllCities();
  const messageLower = message.toLowerCase();
  
  for (const city of cities) {
    if (messageLower.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  // Check for states
  const states = [
    'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana',
    'Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'West Bengal'
  ];
  
  for (const state of states) {
    if (messageLower.includes(state.toLowerCase())) {
      return state;
    }
  }
  
  return null;
}

/**
 * Extract enquiry type from message
 * @param {string} message - User message
 * @returns {string} Enquiry type
 */
function extractEnquiryType(message) {
  const messageLower = message.toLowerCase();
  
  if (messageLower.match(/\b(investment|cost|money|capital|fund|breakup)\b/)) {
    return 'investment';
  }
  if (messageLower.match(/\b(revenue|profit|roi|return|earn|income)\b/)) {
    return 'revenue';
  }
  if (messageLower.match(/\b(support|training|help|assistance)\b/)) {
    return 'support';
  }
  if (messageLower.match(/\b(location|area|city|state|place)\b/)) {
    return 'location';
  }
  
  return 'general';
}

/**
 * Format lead message for regional advisor
 * @param {Object} lead - Lead information
 * @returns {string} Formatted message
 */
function formatLeadMessage(lead) {
  const timestamp = new Date(lead.createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let message = `🚨 *NEW FRANCHISE ENQUIRY*\n\n`;
  message += `▸ *Lead ID:* ${lead.id}\n`;
  message += `▸ *Date/Time:* ${timestamp}\n`;
  message += `▸ *Customer Phone:* ${lead.customerPhone}\n`;
  
  if (lead.customerName && lead.customerName !== 'Unknown') {
    message += `▸ *Customer Name:* ${lead.customerName}\n`;
  }
  
  if (lead.location && lead.location !== 'Not specified') {
    message += `▸ *Location Interest:* ${lead.location}\n`;
  }
  
  message += `▸ *Enquiry Type:* ${lead.enquiryType}\n`;
  
  if (lead.enquiryMessage) {
    message += `\n📝 *Customer Message:*\n"${lead.enquiryMessage}"\n`;
  }
  
  if (lead.interestedIn && lead.interestedIn.length > 0) {
    message += `\n💡 *Interested In:*\n`;
    lead.interestedIn.forEach(item => {
      message += `  • ${item}\n`;
    });
  }
  
  message += `\n────────────────────────\n`;
  message += `⚡ *ACTION REQUIRED*\n`;
  message += `Please contact the customer within 24 hours.\n\n`;
  message += `📊 This lead has been logged in the master dashboard.`;
  
  return message;
}

/**
 * Forward franchise enquiry to regional advisor
 * @param {string} customerPhone - Customer's WhatsApp number (from)
 * @param {string} customerMessage - Customer's original message
 * @param {string} customerName - Customer's name (optional)
 * @returns {Promise<Object>} Result with success status and details
 */
async function forwardFranchiseEnquiry(customerPhone, customerMessage, customerName = 'Unknown') {
  try {
    // Check if any regional advisors are configured
    if (!hasActiveAdvisors()) {
      console.log('⚠️ No regional advisors configured yet. Lead will be logged only.');
      
      // Still create lead for dashboard tracking
      const location = detectLocationFromMessage(customerMessage);
      const enquiryType = extractEnquiryType(customerMessage);
      
      const lead = await leadDashboardService.createLead({
        customerPhone,
        customerName,
        location,
        enquiryType,
        enquiryMessage: customerMessage,
        interestedIn: ['Franchise Opportunity']
      });
      
      return {
        success: true,
        forwarded: false,
        lead,
        message: 'Lead logged. Regional advisors not yet configured.'
      };
    }

    // Detect location from message
    const location = detectLocationFromMessage(customerMessage);
    
    // Find appropriate regional advisor
    const advisor = getAdvisorByLocation(location);
    
    if (!advisor) {
      console.log('⚠️ No matching regional advisor found for location:', location);
      
      // Create lead without forwarding
      const enquiryType = extractEnquiryType(customerMessage);
      const lead = await leadDashboardService.createLead({
        customerPhone,
        customerName,
        location: location || 'Not specified',
        enquiryType,
        enquiryMessage: customerMessage,
        interestedIn: ['Franchise Opportunity']
      });
      
      return {
        success: true,
        forwarded: false,
        lead,
        message: 'Lead logged. No matching regional advisor found.'
      };
    }

    // Create lead in dashboard
    const enquiryType = extractEnquiryType(customerMessage);
    const lead = await leadDashboardService.createLead({
      customerPhone,
      customerName,
      location: location || 'Not specified',
      enquiryType,
      enquiryMessage: customerMessage,
      interestedIn: ['Franchise Opportunity'],
      assignedTo: advisor.name,
      regionalAdvisor: {
        name: advisor.name,
        region: advisor.region,
        whatsappNumber: advisor.whatsappNumber
      }
    });

    // Format message for regional advisor
    const forwardMessage = formatLeadMessage(lead);

    // Send message to regional advisor via Twilio WhatsApp
    const client = getTwilioClient();
    if (!client) {
      throw new Error('Twilio client not configured');
    }
    
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || process.env.TWILIO_WHATSAPP_NUMBER;
    if (!fromNumber) {
      throw new Error('Twilio WhatsApp number not configured in environment variables');
    }
    
    const message = await client.messages.create({
      from: fromNumber,
      to: `whatsapp:${advisor.whatsappNumber}`,
      body: forwardMessage
    });

    // Mark lead as forwarded
    await leadDashboardService.markLeadForwarded(lead.id, {
      name: advisor.name,
      region: advisor.region,
      whatsappNumber: advisor.whatsappNumber,
      twilioMessageSid: message.sid
    });

    console.log(`✅ Franchise enquiry forwarded to ${advisor.name}`);
    console.log(`   Lead ID: ${lead.id}`);
    console.log(`   Twilio SID: ${message.sid}`);

    return {
      success: true,
      forwarded: true,
      lead,
      advisor,
      twilioMessageSid: message.sid,
      message: `Enquiry forwarded to ${advisor.name}`
    };

  } catch (error) {
    console.error('❌ Error forwarding franchise enquiry:', error);
    
    // Still try to log the lead even if forwarding fails
    try {
      const location = detectLocationFromMessage(customerMessage);
      const enquiryType = extractEnquiryType(customerMessage);
      
      const lead = await leadDashboardService.createLead({
        customerPhone,
        customerName,
        location: location || 'Not specified',
        enquiryType,
        enquiryMessage: customerMessage,
        interestedIn: ['Franchise Opportunity']
      });
      
      await leadDashboardService.addLeadNote(
        lead.id,
        `Forwarding failed: ${error.message}`,
        'error'
      );
      
      return {
        success: false,
        forwarded: false,
        lead,
        error: error.message,
        message: 'Lead logged but forwarding failed'
      };
    } catch (leadError) {
      console.error('❌ Error logging lead:', leadError);
      return {
        success: false,
        forwarded: false,
        error: error.message,
        message: 'Failed to forward and log lead'
      };
    }
  }
}

/**
 * Send confirmation to customer that enquiry is being processed
 * @param {string} customerPhone - Customer's WhatsApp number
 * @param {string} leadId - Lead ID for reference
 * @param {boolean} forwarded - Whether enquiry was forwarded to advisor
 */
async function sendCustomerConfirmation(customerPhone, leadId, forwarded = true) {
  try {
    let confirmationMessage;
    
    if (forwarded) {
      confirmationMessage = `✅ *Thank you for your franchise enquiry!*\n\n`;
      confirmationMessage += `Your enquiry has been received and forwarded to our regional franchise advisor.\n\n`;
      confirmationMessage += `▸ *Reference ID:* ${leadId}\n`;
      confirmationMessage += `▸ *Next Step:* Our advisor will contact you within 24 hours\n\n`;
      confirmationMessage += `For immediate assistance:\n`;
      confirmationMessage += `📞 Call: 1800-XXX-XXXX (Toll Free)\n`;
      confirmationMessage += `📧 Email: franchise@mckingstown.com\n\n`;
      confirmationMessage += `We look forward to partnering with you! 🤝`;
    } else {
      confirmationMessage = `✅ *Thank you for your franchise enquiry!*\n\n`;
      confirmationMessage += `We have received your enquiry and our team will review it shortly.\n\n`;
      confirmationMessage += `▸ *Reference ID:* ${leadId}\n`;
      confirmationMessage += `▸ *Next Step:* Our team will contact you within 24-48 hours\n\n`;
      confirmationMessage += `For immediate assistance:\n`;
      confirmationMessage += `📞 Call: 1800-XXX-XXXX (Toll Free)\n`;
      confirmationMessage += `📧 Email: franchise@mckingstown.com\n\n`;
      confirmationMessage += `McKingstown - India's Premier Grooming Chain 👑`;
    }

    const client = getTwilioClient();
    if (!client) {
      throw new Error('Twilio client not configured');
    }
    
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || process.env.TWILIO_WHATSAPP_NUMBER;
    if (!fromNumber) {
      throw new Error('Twilio WhatsApp number not configured in environment variables');
    }
    
    const message = await client.messages.create({
      from: fromNumber,
      to: `whatsapp:${customerPhone}`,
      body: confirmationMessage
    });

    console.log(`✅ Confirmation sent to customer: ${customerPhone}`);
    return { success: true, messageSid: message.sid };

  } catch (error) {
    console.error('❌ Error sending confirmation to customer:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  forwardFranchiseEnquiry,
  sendCustomerConfirmation,
  detectLocationFromMessage,
  extractEnquiryType,
  formatLeadMessage
};
