const twilio = require('twilio');

class TwilioService {
  constructor() {
    // Load credentials from environment variables
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

    // Validate required environment variables
    if (!this.accountSid || !this.authToken || !this.whatsappFrom) {
      throw new Error('Twilio credentials are not properly configured in environment variables');
    }

    // Initialize Twilio client
    this.client = twilio(this.accountSid, this.authToken);

    console.log('✅ Twilio service initialized');
    console.log(`   WhatsApp From: ${this.whatsappFrom}`);
  }

  /**
   * Send WhatsApp message to user
   * @param {string} to - Recipient WhatsApp number (format: whatsapp:+1234567890)
   * @param {string} message - Message text to send
   * @returns {object} Twilio message response
   */
  async sendWhatsAppMessage(to, message) {
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
