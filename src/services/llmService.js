const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * LLM Service using Google Gemini for intelligent responses
 * Provides natural language understanding for ANY user question
 */
class LLMService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.mockMode = !this.apiKey;
    
    if (this.mockMode) {
      console.log('⚠️  GEMINI_API_KEY not set - LLM features limited to patterns');
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      console.log('✅ Gemini AI initialized - Universal question answering enabled');
    }
    
    // McKingstown knowledge base for context
    this.knowledgeBase = `
# McKingstown Men's Salon - Complete Information

## About Us
- Premier men's grooming chain in India
- 10+ years of experience
- 134+ outlets across India and Dubai
- Affordable luxury grooming
- Professional stylists and barbers

## Services & Prices

### Haircut Services
- Basic Haircut: ₹75
- Premium Haircut: ₹150
- Kids Haircut: ₹75
- Style Cut (Fade/Taper): ₹200
- Mullet/Champ Cut: ₹250

### Beard Services
- Beard Trim: ₹40
- Zero Trim: ₹50
- Beard Styling: ₹100
- Full Beard Grooming: ₹150

### Facial Services
- Basic Facial: ₹300
- Premium Glow Facial: ₹500
- Anti-Aging Facial: ₹700
- Skin Brightening: ₹600

### Hair Spa Services
- Basic Hair Spa: ₹400
- Anti-Dandruff Treatment: ₹500
- Hair Fall Control: ₹600
- Scalp Detox: ₹800

### Color Services
- Full Hair Color: ₹800
- Beard Color: ₹300
- Highlights: ₹1200
- Streaks: ₹1500

### Wedding Packages
- Basic Groom Package: ₹2,999
- Premium Groom Package: ₹5,999
- Deluxe Groom Package: ₹9,999

### Massage Services
- Head Massage: ₹150
- Oil Massage: ₹200
- Full Relaxation: ₹400

## Timing
- Monday to Saturday: 9:00 AM - 9:00 PM
- Sunday: 10:00 AM - 8:00 PM
- Open 7 days a week
- Walk-ins welcome
- Appointments recommended for weekends

## Locations
- 134+ outlets across India and Dubai
- Major presence in: Chennai (70+), Bangalore, Coimbatore, Madurai, Salem, Trichy, Tirupati, Surat, Ahmedabad
- International outlet: Dubai (Al Qusais)
- Growing rapidly across South India and Gujarat

## Franchise Opportunity
- Total Investment: ₹19 Lakhs (₹19,00,000)
- Breakup:
  - Franchise Fee: ₹5 Lakhs
  - Interior Setup: ₹8 Lakhs
  - Equipment: ₹3 Lakhs
  - Working Capital: ₹3 Lakhs
- ROI: 18-24 months
- Revenue Potential: ₹40-50 Lakhs/year
- Profit Margin: 30-35%
- Support: Complete training, marketing, operations
- Area Required: 400-600 sq ft
- Staff Required: 3-5 skilled barbers

## Contact
- Website: www.mckingstown.com
- For franchise inquiries, ask to speak with franchise team
- For appointments, contact nearest outlet
- WhatsApp support available

## Special Features
- Hygienic practices
- Branded products
- Skilled professionals
- Modern equipment
- Comfortable ambiance
- Affordable pricing
- Quality service guaranteed
`;
  }

  /**
   * Get intelligent response using Gemini AI
   * @param {string} userMessage - User's question
   * @param {string} conversationContext - Previous conversation context (optional)
   * @returns {Promise<string>} - AI-generated response
   */
  async getIntelligentResponse(userMessage, conversationContext = '') {
    if (this.mockMode) {
      return this.getMockIntelligentResponse(userMessage);
    }

    try {
      // Create context-aware prompt
      const prompt = `You are McKingstown's AI assistant - a professional, friendly men's salon chatbot.

Context about McKingstown:
${this.knowledgeBase}

Previous conversation: ${conversationContext}

User's question: "${userMessage}"

Instructions:
1. Answer professionally and conversationally
2. Use information from the knowledge base above
3. If question is about services/prices/locations/franchise - provide specific details
4. If question is unrelated to McKingstown - politely redirect to salon topics
5. Keep responses concise (max 200 words)
6. Use WhatsApp-friendly formatting: *bold*, ▸ bullets, ➤ arrows
7. Always be helpful and encouraging
8. For appointments, ask for city name to provide outlet details
9. For franchise inquiries, show investment details
10. Sound natural and human-like

Response:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('🤖 Gemini AI Response Generated');
      return text.trim();
      
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      
      // Fallback to pattern-based response
      return this.getMockIntelligentResponse(userMessage);
    }
  }

  /**
   * Mock intelligent response (when API key not available)
   * Uses basic patterns but tries to be helpful
   */
  getMockIntelligentResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    // Try to understand intent and provide reasonable response
    if (messageLower.match(/\b(hello|hi|hey|greetings)\b/)) {
      return `▸ *Welcome to McKingstown Men's Salon*

I'm here to help you with our services, pricing, appointments, and franchise opportunities.

What would you like to know?`;
    }
    
    if (messageLower.match(/\b(how are you|how do you do|what's up|wassup)\b/)) {
      return `I'm doing great, thank you for asking! 😊

I'm here to assist you with McKingstown services. How can I help you today?`;
    }
    
    if (messageLower.match(/\b(who are you|what are you|your name)\b/)) {
      return `I'm McKingstown's AI assistant, here to help you with:

▸ Service information and pricing
▸ Outlet locations (134+ across India & Dubai)
▸ Appointment booking
▸ Franchise opportunities

What would you like to know?`;
    }
    
    if (messageLower.match(/\b(quality|good|best|professional|skilled)\b/)) {
      return `▸ *McKingstown Quality Standards*

✅ 10+ years of grooming excellence
✅ Skilled & trained professionals
✅ Hygienic practices
✅ Premium products
✅ Modern equipment
✅ 134+ outlets across India & Dubai

We ensure quality service at affordable prices. Type *"menu"* to see our services!`;
    }
    
    if (messageLower.match(/\b(why|what makes|difference|special)\b/)) {
      return `▸ *Why Choose McKingstown?*

➤ *Affordable Luxury* - Premium services at reasonable prices
➤ *Experienced* - 10+ years in the industry
➤ *Extensive Network* - 134+ outlets for convenience
➤ *Skilled Team* - Professional barbers & stylists
➤ *Quality Products* - Branded grooming products

We're India's trusted men's grooming destination. What service interests you?`;
    }
    
    // Generic helpful response
    return `I'm McKingstown's assistant, here to help you with our salon services.

I can provide information about:
  ➤ Services & Pricing (haircut, beard, facial, spa)
  ➤ Outlet Locations (134+ outlets)
  ➤ Booking Appointments
  ➤ Franchise Opportunities

Type *"menu"* for complete service list, or ask me anything about McKingstown!`;
  }

  /**
   * Check if message needs LLM processing (not a simple keyword match)
   * @param {string} message - User message
   * @returns {boolean} - True if should use LLM
   */
  shouldUseLLM(message) {
    const messageLower = message.toLowerCase();
    
    // Skip LLM for simple keyword queries (faster response)
    const simpleKeywords = [
      'menu', 'price list', 'franchise', 'haircut', 'beard', 
      'facial', 'spa', 'color', 'wedding', 'massage'
    ];
    
    for (const keyword of simpleKeywords) {
      if (messageLower === keyword || messageLower === `show ${keyword}`) {
        return false; // Use fast keyword response
      }
    }
    
    // Use LLM for:
    // - Questions (who, what, when, where, why, how)
    // - Complex sentences
    // - Conversational phrases
    // - Multi-word queries not matching patterns
    
    const needsLLM = 
      message.split(' ').length > 3 || // Multi-word query
      messageLower.match(/\b(who|what|when|where|why|how|can|could|would|should|do you|are you|tell me|explain|difference|compare|better|best)\b/) ||
      messageLower.match(/\b(hello|hi|hey|thanks|thank you|good|great|awesome|nice)\b/);
    
    return needsLLM;
  }
}

module.exports = new LLMService();
