const twilio = require('twilio');

class TwilioService {
  constructor() {
    // Load credentials from environment variables
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
    this.mockMode = false;

    // Validate required environment variables
    if (!this.accountSid || !this.authToken || !this.whatsappFrom) {
      console.log('⚠️  Twilio credentials not set - using MOCK mode (FREE)');
      console.log('   For production WhatsApp, set: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM');
      this.mockMode = true;
      return;
    }

    // Initialize Twilio client
    try {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('✅ Twilio service initialized');
      console.log(`   WhatsApp From: ${this.whatsappFrom}`);
    } catch (error) {
      console.error('❌ Failed to initialize Twilio, using MOCK mode');
      this.mockMode = true;
    }
  }

  /**
   * Send WhatsApp message to user
   * @param {string} to - Recipient WhatsApp number (format: whatsapp:+1234567890)
   * @param {string} message - Message text to send
   * @returns {object} Twilio message response
   */
  async sendWhatsAppMessage(to, message) {
    // Mock mode - just log, don't actually send
    if (this.mockMode) {
      console.log('🤖 MOCK: Would send WhatsApp message:', {
        to,
        messageLength: message.length,
        preview: message.substring(0, 100) + (message.length > 100 ? '...' : '')
      });
      return {
        success: true,
        messageSid: 'mock-sid-' + Date.now(),
        status: 'mock-sent',
        mock: true
      };
    }

    try {
      console.log('📤 Sending WhatsApp message:', {
        to,
        messageLength: message.length
      });

      const response = await this.client.messages.create({
        from: this.whatsappFrom,
        to: to,
        body: message
      });

      console.log('✅ Message sent successfully:', {
        sid: response.sid,
        status: response.status
      });

      return {
        success: true,
        messageSid: response.sid,
        status: response.status
      };

    } catch (error) {
      console.error('❌ Twilio send error:', error.message);
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }

  /**
   * Send WhatsApp message with media
   * @param {string} to - Recipient WhatsApp number
   * @param {string} message - Message text
   * @param {string} mediaUrl - URL of media to send
   * @returns {object} Twilio message response
   */
  async sendWhatsAppMessageWithMedia(to, message, mediaUrl) {
    // Mock mode
    if (this.mockMode) {
      console.log('🖼️ MOCK: Would send media:', { to, mediaUrl });
      return { success: true, messageSid: 'mock-media-' + Date.now(), mock: true };
    }

    try {
      console.log('📤 Sending WhatsApp message with media:', {
        to,
        mediaUrl
      });

      const response = await this.client.messages.create({
        from: this.whatsappFrom,
        to: to,
        body: message,
        mediaUrl: [mediaUrl]
      });

      console.log('✅ Message with media sent successfully:', {
        sid: response.sid,
        status: response.status
      });

      return {
        success: true,
        messageSid: response.sid,
        status: response.status
      };

    } catch (error) {
      console.error('❌ Twilio send media error:', error.message);
      throw new Error(`Failed to send WhatsApp message with media: ${error.message}`);
    }
  }

  /**
   * Send location message (WhatsApp location pin)
   * @param {string} to - Recipient WhatsApp number
   * @param {number} latitude - Location latitude
   * @param {number} longitude - Location longitude
   * @param {string} name - Location name
   * @param {string} address - Location address
   * @returns {object} Response
   */
  async sendLocation(to, latitude, longitude, name, address) {
    // Mock mode
    if (this.mockMode) {
      console.log('📍 MOCK: Would send location:', { to, name, latitude, longitude });
      return { success: true, messageSid: 'mock-location-' + Date.now(), mock: true };
    }

    try {
      // WhatsApp location format: latitude,longitude|name|address
      const locationMessage = `📍 *${name}*\n${address}\n\nGoogle Maps: https://maps.google.com/?q=${latitude},${longitude}`;
      
      const response = await this.client.messages.create({
        from: this.whatsappFrom,
        to: to,
        body: locationMessage
      });

      console.log('✅ Location sent successfully');
      return { success: true, messageSid: response.sid, status: response.status };
    } catch (error) {
      console.error('❌ Failed to send location:', error.message);
      throw error;
    }
  }

  /**
   * Get message status
   * @param {string} messageSid - Twilio message SID
   * @returns {object} Message status
   */
  async getMessageStatus(messageSid) {
    try {
      const message = await this.client.messages(messageSid).fetch();
      
      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };

    } catch (error) {
      console.error('❌ Twilio fetch error:', error.message);
      throw new Error(`Failed to fetch message status: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new TwilioService();
