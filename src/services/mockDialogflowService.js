/**
 * Mock Dialogflow Service for FREE local testing
 * Use when you don't have Dialogflow credentials
 */

class MockDialogflowService {
  constructor() {
    console.log('🧪 MOCK DIALOGFLOW - Using fallback intent detection (FREE mode)');
  }

  async detectIntent(sessionId, query) {
    const queryLower = query.toLowerCase();
    
    // Simple keyword-based intent detection
    let intent = 'Default Fallback Intent';
    let confidence = 0.5;

    if (queryLower.match(/\b(hi|hello|hey|start)\b/)) {
      intent = 'Welcome';
      confidence = 0.9;
    } else if (queryLower.match(/\b(time|timing|hour|open|close)\b/)) {
      intent = 'Timing';
      confidence = 0.85;
    } else if (queryLower.match(/\b(where|location|address|near)\b/)) {
      intent = 'Location';
      confidence = 0.85;
    } else if (queryLower.match(/\b(book|appointment)\b/)) {
      intent = 'Appointment';
      confidence = 0.85;
    } else if (queryLower.match(/\b(franchise)\b/)) {
      intent = 'Franchise_Inquiry';
      confidence = 0.9;
    } else if (queryLower.match(/\b(haircut|hair)\b/)) {
      intent = 'Haircut_Price';
      confidence = 0.8;
    } else if (queryLower.match(/\b(beard|shave)\b/)) {
      intent = 'Beard_Service';
      confidence = 0.8;
    } else if (queryLower.match(/\b(facial|face)\b/)) {
      intent = 'Facial_Service';
      confidence = 0.8;
    } else if (queryLower.match(/\b(thank|thanks)\b/)) {
      intent = 'Thanks';
      confidence = 0.9;
    } else if (queryLower.match(/\b(bye|goodbye)\b/)) {
      intent = 'Goodbye';
      confidence = 0.9;
    }

    console.log(`🤖 MOCK Intent: "${intent}" (confidence: ${confidence})`);

    return {
      intent,
      confidence,
      fulfillmentText: '', // Empty - we generate our own responses
      parameters: {}
    };
  }
}

module.exports = new MockDialogflowService();
