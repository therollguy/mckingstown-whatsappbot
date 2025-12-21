const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

class DialogflowService {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    this.mockMode = false;
    
    // Check if Dialogflow is configured
    if (!this.projectId) {
      console.log('⚠️  DIALOGFLOW_PROJECT_ID not set - using MOCK mode (FREE)');
      this.mockMode = true;
      return;
    }

    // Handle Base64 encoded credentials (for Render.com and other cloud platforms)
    if (process.env.GOOGLE_CREDENTIALS_BASE64) {
      try {
        const credentials = JSON.parse(
          Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
        );
        
        this.sessionClient = new dialogflow.SessionsClient({
          credentials: credentials
        });
        
        console.log('✅ Dialogflow service initialized (Base64 credentials)');
        console.log(`   Project ID: ${this.projectId}`);
      } catch (error) {
        console.error('❌ Failed to parse Base64 credentials, using MOCK mode');
        this.mockMode = true;
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use JSON file path (for local development)
      try {
        this.sessionClient = new dialogflow.SessionsClient();
        console.log('✅ Dialogflow service initialized (JSON file credentials)');
        console.log(`   Project ID: ${this.projectId}`);
      } catch (error) {
        console.error('❌ Failed to initialize Dialogflow, using MOCK mode');
        this.mockMode = true;
      }
    } else {
      console.log('⚠️  No Google credentials provided - using MOCK mode (FREE)');
      this.mockMode = true;
    }
  }

  /**
   * Detect intent from user message
   * @param {string} sessionId - Unique session ID (user phone number)
   * @param {string} messageText - User's message text
   * @param {string} languageCode - Language code (default: en)
   * @returns {object} Dialogflow response
   */
  async detectIntent(sessionId, messageText, languageCode = 'en') {
    // If in mock mode, return mock response
    if (this.mockMode) {
      return this.getMockIntent(messageText);
    }

    try {
      // Create session path
      const sessionPath = this.sessionClient.projectAgentSessionPath(
        this.projectId,
        sessionId
      );

      // Prepare request
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: messageText,
            languageCode: languageCode,
          },
        },
      };

      console.log('🔍 Dialogflow request:', {
        sessionId,
        messageText,
        languageCode
      });

      // Send request to Dialogflow
      const [response] = await this.sessionClient.detectIntent(request);
      const result = response.queryResult;

      // Extract intent and fulfillment text
      const intentName = result.intent ? result.intent.displayName : 'Unknown';
      const confidence = result.intentDetectionConfidence || 0;
      const fulfillmentText = result.fulfillmentText || 'Sorry, I did not understand that.';
      const parameters = result.parameters ? result.parameters.fields : {};

      console.log('✅ Intent detected:', {
        intent: intentName,
        confidence: confidence.toFixed(2)
      });

      return {
        intent: intentName,
        confidence,
        fulfillmentText,
        parameters,
        queryText: result.queryText,
        allRequiredParamsPresent: result.allRequiredParamsPresent,
        webhookPayload: result.webhookPayload
      };

    } catch (error) {
      console.error('❌ Dialogflow error:', error.message);
      // Fall back to mock mode on error
      return this.getMockIntent(messageText);
    }
  }

  /**
   * Get mock intent response (when Dialogflow is not configured)
   * @param {string} messageText - User's message
   * @returns {object} Mock Dialogflow response
   */
  getMockIntent(messageText) {
    const lower = messageText.toLowerCase();
    
    // Detect intent based on keywords
    let intent = 'Default Fallback Intent';
    let confidence = 0.5;
    
    if (lower.match(/\b(hi|hello|hey|greet)\b/)) {
      intent = 'Welcome';
      confidence = 0.8;
    } else if (lower.match(/\b(time|timing|hour|open|close)\b/)) {
      intent = 'Timing';
      confidence = 0.8;
    } else if (lower.match(/\b(where|location|address|near|outlet)\b/)) {
      intent = 'Location';
      confidence = 0.8;
    } else if (lower.match(/\b(book|appointment|schedule)\b/)) {
      intent = 'Appointment';
      confidence = 0.8;
    } else if (lower.match(/\b(thank|thanks)\b/)) {
      intent = 'Thanks';
      confidence = 0.8;
    } else if (lower.match(/\b(bye|goodbye)\b/)) {
      intent = 'Goodbye';
      confidence = 0.8;
    }
    
    console.log('🤖 Mock intent:', { intent, confidence });
    
    return {
      intent,
      confidence,
      fulfillmentText: 'Mock response',
      parameters: {},
      queryText: messageText,
      allRequiredParamsPresent: true,
      webhookPayload: null
    };
  }

  /**
   * Detect intent with event (for triggering specific intents)
   * @param {string} sessionId - Unique session ID
   * @param {string} eventName - Event name to trigger
   * @param {string} languageCode - Language code
   * @returns {object} Dialogflow response
   */
  async detectIntentWithEvent(sessionId, eventName, languageCode = 'en') {
    if (this.mockMode) {
      return {
        intent: eventName,
        confidence: 0.8,
        fulfillmentText: 'Mock event response',
        parameters: {}
      };
    }

    try {
      const sessionPath = this.sessionClient.projectAgentSessionPath(
        this.projectId,
        sessionId
      );

      const request = {
        session: sessionPath,
        queryInput: {
          event: {
            name: eventName,
            languageCode: languageCode,
          },
        },
      };

      const [response] = await this.sessionClient.detectIntent(request);
      const result = response.queryResult;

      return {
        intent: result.intent ? result.intent.displayName : 'Unknown',
        confidence: result.intentDetectionConfidence || 0,
        fulfillmentText: result.fulfillmentText || '',
        parameters: result.parameters ? result.parameters.fields : {}
      };

    } catch (error) {
      console.error('❌ Dialogflow event error:', error.message);
      return this.getMockIntent(eventName);
    }
  }
}

// Export singleton instance
module.exports = new DialogflowService();
