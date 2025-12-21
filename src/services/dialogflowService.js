const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

class DialogflowService {
  constructor() {
    this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
    
    // Validate required environment variables
    if (!this.projectId) {
      throw new Error('DIALOGFLOW_PROJECT_ID is not set in environment variables');
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
      } catch (error) {
        throw new Error(`Failed to parse Base64 credentials: ${error.message}`);
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Use JSON file path (for local development)
      this.sessionClient = new dialogflow.SessionsClient();
      console.log('✅ Dialogflow service initialized (JSON file credentials)');
    } else {
      throw new Error('No Google credentials provided. Set either GOOGLE_CREDENTIALS_BASE64 or GOOGLE_APPLICATION_CREDENTIALS');
    }
    
    console.log(`   Project ID: ${this.projectId}`);
  }

  /**
   * Detect intent from user message
   * @param {string} sessionId - Unique session ID (user phone number)
   * @param {string} messageText - User's message text
   * @param {string} languageCode - Language code (default: en)
   * @returns {object} Dialogflow response
   */
  async detectIntent(sessionId, messageText, languageCode = 'en') {
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
      throw new Error(`Dialogflow API error: ${error.message}`);
    }
  }

  /**
   * Detect intent with event (for triggering specific intents)
   * @param {string} sessionId - Unique session ID
   * @param {string} eventName - Event name to trigger
   * @param {string} languageCode - Language code
   * @returns {object} Dialogflow response
   */
  async detectIntentWithEvent(sessionId, eventName, languageCode = 'en') {
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
      throw new Error(`Dialogflow event API error: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new DialogflowService();
