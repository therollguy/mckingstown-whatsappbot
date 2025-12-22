const axios = require('axios');

/**
 * LLM Service using Google Gemini for intelligent responses
 * Provides natural language understanding for ANY user question
 */
class LLMService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.enabled = process.env.ENABLE_GEMINI_FALLBACK === 'true' && !!this.apiKey;
    this.mockMode = !this.enabled;

    // If we detect a permanently broken config (e.g., invalid API key),
    // we can disable Gemini for the rest of the process to avoid repeated retries.
    this.disabledReason = null;

    // NOTE: The REST endpoint already includes `/models/` in the path.
    // Users sometimes paste model names returned by ListModels (e.g. `models/gemini-2.0-flash`).
    // Normalize to the short form expected in the URL segment.
    this.model = this.#normalizeModelName((process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim());
    this.fallbackModels = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.0-flash,gemini-2.5-flash,gemini-2.5-pro')
      .split(',')
      .map(s => this.#normalizeModelName(s.trim()))
      .filter(Boolean);

    // Prefer v1; fall back to v1beta for accounts/regions where v1 may not be enabled.
    this.apiVersions = (process.env.GEMINI_API_VERSIONS || 'v1,v1beta')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    this.timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 8000);
    this.maxOutputTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 320);
    this.temperature = Number(process.env.GEMINI_TEMPERATURE || 0.2);
    
    if (!this.apiKey) {
      console.log('⚠️  GEMINI_API_KEY not set - Gemini fallback disabled');
    } else if (!this.enabled) {
      console.log('ℹ️  Gemini fallback is OFF. Set ENABLE_GEMINI_FALLBACK=true to enable.');
    } else {
      console.log('✅ Gemini fallback enabled');
      console.log(`   Model: ${this.model}`);
      console.log(`   API versions: ${this.apiVersions.join(', ')}`);
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

  #disableGemini(reason) {
    if (this.disabledReason) return;
    this.disabledReason = reason || 'disabled';
    this.enabled = false;
    this.mockMode = true;
  }

  /**
   * Get intelligent response using Gemini AI
   * @param {string} userMessage - User's question
   * @param {string} conversationContext - Previous conversation context (optional)
   * @returns {Promise<string>} - AI-generated response
   */
  async getIntelligentResponse(userMessage, conversationContext = '') {
    const result = await this.getIntelligentResponseWithMeta(userMessage, conversationContext);
    return result.text;
  }

  /**
   * Same as getIntelligentResponse, but returns metadata useful for debugging.
   * @returns {Promise<{text: string, meta: { attempted: boolean, mode: 'gemini'|'mock', apiVersion?: string, modelName?: string, reason?: string, error?: string }}>
   */
  async getIntelligentResponseWithMeta(userMessage, conversationContext = '') {
    if (this.mockMode) {
      return {
        text: this.getMockIntelligentResponse(userMessage),
        meta: { attempted: false, mode: 'mock', reason: this.disabledReason || 'disabled' }
      };
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

      const result = await this.#generateWithRetry(prompt);
      console.log(`🤖 Gemini fallback response generated (${result.apiVersion}/${result.modelName})`);

      return {
        text: this.#trimToWhatsAppLimit(result.text),
        meta: { attempted: true, mode: 'gemini', apiVersion: result.apiVersion, modelName: result.modelName }
      };
      
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);

      // Circuit breaker: invalid API key will never succeed until env var is fixed.
      // Avoid spamming retries on every message (adds latency and noise).
      const msg = (error && error.message) ? String(error.message) : '';
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
        this.disabledReason = 'api_key_invalid';
        this.enabled = false;
        this.mockMode = true;
        console.error('🛑 Disabling Gemini fallback for this process (invalid API key). Fix GEMINI_API_KEY and restart the server.');
      }
      
      // Fallback to pattern-based response
      return {
        text: this.getMockIntelligentResponse(userMessage),
        meta: {
          attempted: true,
          mode: 'mock',
          reason: this.disabledReason || 'error',
          error: error.message
        }
      };
    }
  }

  /**
   * Whether Gemini fallback is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Conservative gating: only use Gemini when we have no deterministic answer.
   * Avoids calling Gemini for commands, single-word keywords, and obvious intents.
   */
  shouldUseLLM(userMessage) {
    if (!this.enabled) return false;
    if (!userMessage || typeof userMessage !== 'string') return false;

    const msg = userMessage.trim();
    if (!msg) return false;
    if (msg.length > 500) return false;

    const lower = msg.toLowerCase();

    // Skip common commands / high-confidence deterministic routes
    const skipPatterns = [
      /^menu$/,
      /^help$/,
      /^hi$/,
      /^hello$/,
      /^franchise$/,
      /^haircut$/,
      /^beard$/,
      /^spa$/,
      /^facial$/,
      /^color$/,
      /^massage$/,
      /^wedding$/,
      /^groom$/,
      /^book$/,
      /^appointment$/,
      /^price$/,
      /^timing(s)?$/,
      /^location(s)?$/,
      /^outlet(s)?$/
    ];
    if (skipPatterns.some(r => r.test(lower))) return false;

    // If it's just a city name, let city detection handle it
    if (/^[a-z\s]{2,30}$/.test(lower) && (lower.includes('chennai') || lower.includes('bangalore') || lower.includes('coimbatore') || lower.includes('madurai') || lower.includes('salem') || lower.includes('trichy') || lower.includes('tirupati') || lower.includes('surat') || lower.includes('ahmedabad') || lower.includes('dubai'))) {
      return false;
    }

    return true;
  }

  #normalizeModelName(modelName) {
    if (!modelName) return '';
    const s = String(modelName).trim();
    if (!s) return '';
    return s.startsWith('models/') ? s.slice('models/'.length) : s;
  }

  async #generateWithRetry(prompt) {
    if (!this.enabled) {
      throw new Error('Gemini fallback disabled');
    }

    // Try configured primary model first, then fallback models.
    const modelsToTry = [this.model, ...this.fallbackModels.filter(m => m !== this.model)];

    let lastError = null;
    for (const apiVersion of this.apiVersions) {
      for (const modelName of modelsToTry) {
        try {
          const text = await this.#generateOnce({ apiVersion, modelName, prompt });
          if (text && typeof text === 'string') {
            return { text, apiVersion, modelName };
          }
        } catch (err) {
          lastError = err;
          const msg = err?.message || String(err);

          // Permanent config errors: stop retrying immediately.
          if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
            this.#disableGemini('api_key_invalid');
            throw err;
          }

          // Keep trying other model/version pairs
          console.warn(`⚠️  Gemini attempt failed (${apiVersion}/${modelName}): ${msg}`);
        }
      }
    }

    throw lastError || new Error('Gemini fallback failed');
  }

  async #generateOnce({ apiVersion, modelName, prompt }) {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${encodeURIComponent(modelName)}:generateContent?key=${this.apiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: this.maxOutputTokens
      }
    };

    const resp = await axios.post(url, body, {
      timeout: this.timeoutMs,
      validateStatus: () => true
    });

    if (resp.status < 200 || resp.status >= 300) {
      const errText = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);

      // If the key is invalid, disable Gemini for the rest of the process to avoid
      // repeated retries on subsequent user messages.
      if (errText.includes('API_KEY_INVALID') || errText.includes('API key not valid')) {
        this.#disableGemini('api_key_invalid');
      }

      throw new Error(`HTTP ${resp.status} ${errText}`);
    }

    const candidates = resp.data?.candidates;
    const text = candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('') || '';
    return text.trim();
  }

  #trimToWhatsAppLimit(text) {
    const max = 3800; // keep margin under WhatsApp 4096
    const t = (text || '').trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 50).trimEnd() + '\n\n▸ Type *"menu"* for services.';
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
}

module.exports = new LLMService();
