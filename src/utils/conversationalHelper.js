/**
 * Natural Language Helper for McKingstown Bot
 * Provides conversational response variations
 */

class ConversationalHelper {
  /**
   * Get varied greeting based on time
   */
  static getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /**
   * Get random variation of affirmative responses
   */
  static getAffirmative() {
    const responses = [
      'Absolutely',
      'Of course',
      'Sure',
      'Certainly',
      'Yes, I can help with that'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get polite closing
   */
  static getClosing() {
    const closings = [
      'Is there anything else I can help you with?',
      'What else would you like to know?',
      'Need help with anything else?',
      'Can I assist you with anything else?'
    ];
    return closings[Math.floor(Math.random() * closings.length)];
  }

  /**
   * Extract city/location from text
   */
  static extractLocation(text) {
    const cities = [
      'chennai', 'bangalore', 'bengaluru', 'mumbai', 'delhi', 'hyderabad', 
      'pune', 'ahmedabad', 'surat', 'kolkata', 'jaipur', 'lucknow', 
      'coimbatore', 'madurai', 'kochi', 'thiruvananthapuram', 'vijayawada',
      'visakhapatnam', 'nagpur', 'indore', 'thane', 'bhopal', 'patna', 'vadodara'
    ];
    
    const textLower = text.toLowerCase();
    for (const city of cities) {
      if (textLower.includes(city)) {
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }
    return null;
  }

  /**
   * Detect if user is asking a question
   */
  static isQuestion(text) {
    const questionWords = ['what', 'when', 'where', 'how', 'why', 'which', 'who', 'can', 'do', 'is', 'are'];
    const textLower = text.toLowerCase();
    return questionWords.some(word => textLower.startsWith(word)) || text.includes('?');
  }

  /**
   * Generate contextual response prefix
   */
  static getResponsePrefix(text) {
    if (this.isQuestion(text)) {
      return this.getAffirmative() + '. ';
    }
    return '';
  }

  /**
   * Add natural conversation flow
   */
  static makeConversational(response, originalText) {
    const prefix = this.getResponsePrefix(originalText);
    const closing = this.getClosing();
    
    return `${prefix}${response}\n\n${closing}`;
  }

  /**
   * Detect sentiment/mood
   */
  static detectSentiment(text) {
    const positive = /\b(good|great|nice|awesome|excellent|perfect|love|best)\b/i;
    const negative = /\b(bad|worst|poor|terrible|horrible|hate)\b/i;
    
    if (positive.test(text)) return 'positive';
    if (negative.test(text)) return 'negative';
    return 'neutral';
  }

  /**
   * Get service category from text
   */
  static detectServiceCategory(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.match(/\b(cut|haircut|hair|style|mullet|fade|taper|champ)\b/)) return 'haircut';
    if (textLower.match(/\b(beard|mustache|moustache|shave|trim)\b/)) return 'beard';
    if (textLower.match(/\b(facial|face|skin|clean)\b/)) return 'facial';
    if (textLower.match(/\b(spa|scalp|treatment)\b/)) return 'spa';
    if (textLower.match(/\b(color|colour|dye|highlight)\b/)) return 'color';
    if (textLower.match(/\b(wedding|marriage|groom)\b/)) return 'wedding';
    if (textLower.match(/\b(massage|oil)\b/)) return 'massage';
    if (textLower.match(/\b(makeup|styling|event)\b/)) return 'groom';
    if (textLower.match(/\b(franchise|business|investment)\b/)) return 'franchise';
    
    return null;
  }
}

module.exports = ConversationalHelper;
