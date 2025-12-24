/**
 * Enhanced Pattern Matcher for McKingstown Bot
 * Provides comprehensive pattern matching with typo tolerance and variations
 */

class PatternMatcher {
  constructor() {
    // Comprehensive pattern database with keywords, variations, typos, and related terms
    this.patterns = {
      // Service patterns
      haircut: {
        exact: ['menu', 'haircut', 'hair cut', 'cut', 'hairstyle', 'hair style', 'cutting'],
        typos: ['harcut', 'hercut', 'hairkat', 'haarcut', 'haircot'],
        related: ['trim', 'chop', 'fade', 'taper', 'mullet', 'champ', 'style', 'buzz', 'crew'],
        questions: ['haircut price', 'how much haircut', 'haircut cost', 'haircut rate', 'cutting price']
      },
      
      beard: {
        exact: ['beard', 'shave', 'shaving', 'mustache', 'moustache', 'facial hair'],
        typos: ['berd', 'baird', 'mushtash', 'shav'],
        related: ['trim beard', 'zero trim', 'goatee', 'stubble', 'beard style', 'beard trim'],
        questions: ['beard price', 'shaving cost', 'beard trimming', 'beard rate']
      },
      
      facial: {
        exact: ['facial', 'face', 'face care', 'skin care', 'cleanup', 'clean up'],
        typos: ['facal', 'facil', 'faceial', 'faceal', 'facel', 'fasial'],
        related: ['glow', 'radiance', 'brightening', 'anti-aging', 'skin', 'face treatment'],
        questions: ['facial price', 'facial cost', 'face treatment cost']
      },
      
      spa: {
        exact: ['spa', 'hair spa', 'scalp treatment', 'hair treatment'],
        typos: ['spaa', 'hairspa'],
        related: ['dandruff', 'hair fall', 'scalp', 'nourish', 'detox', 'conditioning'],
        questions: ['spa price', 'hair spa cost', 'hair treatment price']
      },
      
      color: {
        exact: ['color', 'colour', 'dye', 'hair color', 'hair colour'],
        typos: ['colr', 'colo', 'culer'],
        related: ['highlight', 'streak', 'tint', 'bleach', 'coloring', 'dyeing'],
        questions: ['color price', 'coloring cost', 'dye cost']
      },
      
      wedding: {
        exact: ['wedding', 'marriage', 'groom', 'bridal', 'bride'],
        typos: ['weding', 'marrage', 'grom'],
        related: ['wedding package', 'groom package', 'ceremony', 'special occasion', 'event'],
        questions: ['wedding package price', 'groom package cost', 'wedding service']
      },
      
      massage: {
        exact: ['massage', 'head massage', 'oil massage'],
        typos: ['masage', 'message', 'masaj'],
        related: ['relaxation', 'oil', 'head', 'stress relief', 'therapy'],
        questions: ['massage price', 'massage cost', 'oil massage cost']
      },
      
      franchise: {
        exact: ['franchise', 'franchisee', 'business', 'partner', 'investment', 'opportunity'],
        typos: ['franchice', 'francise', 'partener'],
        related: ['business opportunity', 'investment opportunity', 'partnership', 'entrepreneur'],
        questions: ['franchise cost', 'how to start franchise', 'franchise investment', 'franchise details']
      },
      
      // Query type patterns
      price: {
        exact: ['price', 'cost', 'charge', 'rate', 'how much', 'pricing'],
        typos: ['prise', 'prise', 'cose', 'rat'],
        related: ['expensive', 'cheap', 'affordable', 'fee', 'amount', 'money'],
        questions: ['what is the price', 'how much does it cost', 'what are the charges']
      },
      
      location: {
        exact: ['where', 'location', 'address', 'near', 'nearby', 'nearest', 'outlet', 'branch'],
        typos: ['loction', 'adress', 'neer', 'outlit'],
        related: ['find', 'search', 'close', 'distance', 'map', 'shop', 'salon'],
        questions: ['where is outlet', 'nearest branch', 'find location', 'outlet near me']
      },
      
      timing: {
        exact: ['time', 'timing', 'hour', 'hours', 'open', 'close', 'schedule'],
        typos: ['tym', 'timeing', 'shedule'],
        related: ['available', 'working hours', 'business hours', 'when open'],
        questions: ['what time open', 'opening hours', 'closing time', 'available time']
      },
      
      booking: {
        exact: ['book', 'booking', 'appointment', 'reserve', 'schedule'],
        typos: ['bok', 'apointment', 'resrve'],
        related: ['book appointment', 'make appointment', 'schedule visit', 'reserve slot'],
        questions: ['how to book', 'book appointment', 'make booking']
      }
    };
  }

  /**
   * Match user message to intents with confidence scoring
   * @param {string} message - User's message
   * @returns {object} - { intent: string, confidence: number, matched: string }
   */
  match(message) {
    const messageLower = message.toLowerCase().trim();
    const scores = {};

    // Calculate scores for each intent
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      let score = 0;
      let matchedTerm = null;

      // Exact match: +100 points
      for (const exact of patterns.exact) {
        if (messageLower.includes(exact)) {
          score += 100;
          matchedTerm = exact;
          break;
        }
      }

      // Question match: +80 points
      if (patterns.questions) {
        for (const question of patterns.questions) {
          if (messageLower.includes(question)) {
            score += 80;
            matchedTerm = question;
            break;
          }
        }
      }

      // Typo match: +70 points
      if (patterns.typos) {
        for (const typo of patterns.typos) {
          if (messageLower.includes(typo)) {
            score += 70;
            matchedTerm = typo;
            break;
          }
        }
      }

      // Related term match: +50 points
      if (patterns.related) {
        for (const related of patterns.related) {
          if (messageLower.includes(related)) {
            score += 50;
            matchedTerm = related;
            break;
          }
        }
      }

      if (score > 0) {
        scores[intent] = { score, matchedTerm };
      }
    }

    // Get highest scoring intent
    const sortedIntents = Object.entries(scores)
      .sort((a, b) => b[1].score - a[1].score);

    if (sortedIntents.length === 0) {
      return { intent: null, confidence: 0, matched: null };
    }

    const [topIntent, data] = sortedIntents[0];
    const confidence = Math.min(data.score / 100, 1.0);

    return {
      intent: topIntent,
      confidence,
      matched: data.matchedTerm,
      allMatches: sortedIntents.map(([intent, data]) => ({
        intent,
        confidence: Math.min(data.score / 100, 1.0),
        matched: data.matchedTerm
      }))
    };
  }

  /**
   * Check if message is a service query
   */
  isServiceQuery(message) {
    const result = this.match(message);
    const serviceIntents = ['haircut', 'beard', 'facial', 'spa', 'color', 'wedding', 'massage'];
    return serviceIntents.includes(result.intent) && result.confidence > 0.5;
  }

  /**
   * Check if message is asking about price
   */
  isPriceQuery(message) {
    const result = this.match(message);
    return result.intent === 'price' && result.confidence > 0.5;
  }

  /**
   * Check if message is asking about location
   */
  isLocationQuery(message) {
    const result = this.match(message);
    return result.intent === 'location' && result.confidence > 0.5;
  }

  /**
   * Check if message is about booking
   */
  isBookingQuery(message) {
    const result = this.match(message);
    return result.intent === 'booking' && result.confidence > 0.5;
  }

  /**
   * Check if message is about franchise
   */
  isFranchiseQuery(message) {
    const result = this.match(message);
    return result.intent === 'franchise' && result.confidence > 0.5;
  }

  /**
   * Check if message is about timing
   */
  isTimingQuery(message) {
    const result = this.match(message);
    return result.intent === 'timing' && result.confidence > 0.5;
  }

  /**
   * Get intent with highest confidence
   */
  getBestIntent(message) {
    const result = this.match(message);
    if (result.confidence > 0.5) {
      return result.intent;
    }
    return null;
  }
}

module.exports = new PatternMatcher();
