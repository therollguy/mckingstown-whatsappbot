# 📱 McKingstown WhatsApp Bot - Complete Capabilities Guide

## Table of Contents
1. [Message Types](#message-types)
2. [Interactive Features](#interactive-features)
3. [Media Support](#media-support)
4. [Location Features](#location-features)
5. [Making Bot Precise](#making-bot-precise)
6. [Advanced Features](#advanced-features)
7. [Best Practices](#best-practices)
8. [Limitations](#limitations)

---

## 1. Message Types

### ✅ Text Messages (Currently Implemented)
```javascript
// Simple text response
replyText = "Welcome to McKingstown!";

// Formatted text with styling
replyText = `
═══ *BOLD HEADING* ═══

▸ *Bold Item*
  ➤ Regular text
  ✅ Checkmark item
  
_Italic text_
~Strikethrough~
`;
```

**What You Can Do:**
- ✅ Bold text: `*bold*` → **bold**
- ✅ Italic: `_italic_` → _italic_
- ✅ Strikethrough: `~text~` → ~~text~~
- ✅ Emojis: All Unicode emojis
- ✅ Line breaks: `\n`
- ✅ Special characters: ►, ✓, ✗, ●, ○, ▸, ➤, ═

---

## 2. Interactive Features

### 🔘 Quick Reply Buttons (Numbered Options)

**Current Implementation:**
```javascript
// Example: Menu navigation
static createButtonMessage(messageText, buttons) {
  let response = messageText + '\n\n';
  response += '▸ *Quick Options:*\n';
  
  buttons.forEach((btn, index) => {
    response += `  ${index + 1}️⃣ *${btn.text}*\n`;
  });
  
  response += '\nReply with the number or type your choice.';
  return response;
}

// Usage
const buttons = [
  { id: 'haircut', text: 'View Haircut Prices' },
  { id: 'beard', text: 'View Beard Services' },
  { id: 'book', text: 'Book Appointment' }
];

const response = ResponseGenerator.createButtonMessage(
  'What would you like to know?', 
  buttons
);
```

**User sees:**
```
What would you like to know?

▸ *Quick Options:*
  1️⃣ *View Haircut Prices*
  2️⃣ *View Beard Services*
  3️⃣ *Book Appointment*

Reply with the number or type your choice.
```

User can reply: `1`, `2`, `3`, or type `haircut`, `beard`, `book`

---

### 📋 List Messages (Alternative to Buttons)

**Implementation:**
```javascript
// For longer lists (4+ options)
static createListMessage(title, sections) {
  let response = `*${title}*\n\n`;
  
  sections.forEach((section, idx) => {
    response += `\n${idx + 1}. *${section.title}*\n`;
    response += `   ${section.description}\n`;
  });
  
  response += '\n_Reply with the number to select_';
  return response;
}

// Usage - City selection
const citySections = [
  { title: 'Chennai', description: '70+ outlets across all areas' },
  { title: 'Bangalore', description: '3 outlets - Electronic City, Silk Board' },
  { title: 'Coimbatore', description: '10+ outlets' },
  { title: 'Madurai', description: '5+ outlets' }
];

const response = ResponseGenerator.createListMessage('Select Your City:', citySections);
```

---

## 3. Media Support

### 📸 Images

**When to Use:**
- Service price lists with images
- Haircut/beard style galleries
- Before/after transformations
- Outlet photos
- Franchise brochures

**Implementation:**
```javascript
// In responseGenerator.js - Already added!
const MEDIA_URLS = {
  servicePriceList: 'https://www.mckingstown.in/images/price-list.jpg',
  haircutStyles: 'https://www.mckingstown.in/images/haircut-styles.jpg',
  beardStyles: 'https://www.mckingstown.in/images/beard-styles.jpg',
  weddingPackage: 'https://www.mckingstown.in/images/wedding-package.jpg'
};

// Send image with text
static getHaircutServicesWithImage() {
  return {
    text: `═══ *HAIRCUT STYLES* ═══
    
Check out our popular haircut styles!
    
➤ Classic Cut - ₹75
➤ Premium Cut - ₹150
➤ Style + Cut - ₹200

Reply with the style number to book.`,
    mediaUrl: MEDIA_URLS.haircutStyles
  };
}
```

**Usage in Webhook:**
```javascript
// When user asks for haircuts
if (messageTextLower.includes('haircut')) {
  const response = ResponseGenerator.getHaircutServicesWithImage();
  
  // Send with media
  await twilioService.sendWhatsAppMessageWithMedia(
    From,
    response.text,
    response.mediaUrl
  );
  return;
}
```

**Supported Formats:**
- ✅ JPEG/JPG
- ✅ PNG
- ✅ GIF
- ❌ WebP (not supported by WhatsApp)

**Image Requirements:**
- Max size: 5MB
- Recommended: 1024x1024px or 16:9 ratio
- Must be publicly accessible URL (https://)

---

### 📄 PDF Documents

**Use Cases:**
- Detailed service menus
- Franchise information packages
- Terms & conditions
- Price lists

**Implementation:**
```javascript
// Add to MEDIA_URLS
const MEDIA_URLS = {
  franchiseBrochure: 'https://www.mckingstown.in/pdfs/franchise-brochure.pdf',
  completeMenu: 'https://www.mckingstown.in/pdfs/complete-menu.pdf'
};

// Send PDF
static getFranchiseBrochure() {
  return {
    text: `📄 *McKingstown Franchise Information*

Here's our complete franchise brochure with:
✅ Investment details
✅ Profit margins
✅ Training & support
✅ Success stories

Opening the PDF...`,
    mediaUrl: MEDIA_URLS.franchiseBrochure
  };
}
```

**PDF Requirements:**
- Max size: 100MB
- Must be publicly accessible
- Opens in WhatsApp's built-in viewer

---

### 🎥 Videos (Future Enhancement)

**Potential Uses:**
- Service demonstrations
- Outlet tours
- Franchise testimonials
- How-to tutorials

**Supported Formats:**
- MP4, 3GP
- Max: 16MB
- Recommended: < 30 seconds

---

## 4. Location Features

### 📍 Send Location Pin

**Already Implemented!**

```javascript
// In twilioService.js - sendLocation() method
async sendLocation(to, latitude, longitude, name, address) {
  const locationMessage = `📍 *${name}*
${address}

Google Maps: https://maps.google.com/?q=${latitude},${longitude}`;
  
  await this.client.messages.create({
    from: this.whatsappFrom,
    to: to,
    body: locationMessage
  });
}
```

**Usage Example:**
```javascript
// In outlets.js - Add coordinates
const outlets = [
  {
    city: 'Chennai',
    area: 'Tambaram',
    address: 'No.5, GST Road, Tambaram West',
    phone: '+91 98765 43210',
    coordinates: { lat: 12.9229, lng: 80.1275 }
  }
];

// In webhook - When user asks for nearest outlet
if (messageTextLower.includes('nearest')) {
  const outlet = findNearestOutlet(userCity);
  
  // Send text + location
  await twilioService.sendWhatsAppMessage(
    From, 
    `Found an outlet near you! 🎯`
  );
  
  await twilioService.sendLocation(
    From,
    outlet.coordinates.lat,
    outlet.coordinates.lng,
    `McKingstown - ${outlet.area}`,
    outlet.address
  );
}
```

**User Experience:**
- Receives clickable map pin
- Tap to open in Google Maps
- Get directions directly

---

## 5. Making Bot Completely Precise

### 🎯 Strategy 1: Comprehensive Pattern Matching

**Current Approach (Good):**
```javascript
if (messageTextLower.includes('haircut')) {
  // return haircut services
}
```

**Enhanced Precision (Better):**
```javascript
// Create exhaustive pattern database
const PATTERNS = {
  haircut: {
    keywords: ['haircut', 'hair cut', 'hairstyle', 'hair style', 'cut hair', 'cutting'],
    variations: ['hairkat', 'hercut', 'haarcut'], // common typos
    related: ['trim', 'chop', 'shave head', 'buzz cut'],
    questions: ['how much for a haircut', 'haircut price', 'cutting rate']
  },
  
  beard: {
    keywords: ['beard', 'facial hair', 'mustache', 'moustache'],
    variations: ['berd', 'baird', 'beerd'],
    related: ['shave', 'trim beard', 'goatee', 'stubble'],
    questions: ['beard trimming cost', 'shaving price']
  }
};

// Fuzzy matching function
function matchIntent(message) {
  const lower = message.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(PATTERNS)) {
    const allPatterns = [
      ...patterns.keywords,
      ...patterns.variations,
      ...patterns.related,
      ...patterns.questions
    ];
    
    for (const pattern of allPatterns) {
      if (lower.includes(pattern)) {
        return intent;
      }
    }
  }
  
  return null;
}
```

---

### 🎯 Strategy 2: Context-Aware Responses

```javascript
// Track conversation context
const conversationContext = new Map();

function handleMessage(from, message, context) {
  const userContext = conversationContext.get(from) || {};
  
  // User previously asked about services
  if (userContext.lastIntent === 'services' && message.match(/\d+/)) {
    const serviceNumber = parseInt(message);
    return getServiceDetails(serviceNumber);
  }
  
  // User previously selected a city
  if (userContext.waitingFor === 'city' && message.match(/[a-z]/i)) {
    return getOutletsByCity(message);
  }
  
  // Save context for next message
  conversationContext.set(from, {
    lastIntent: detectIntent(message),
    lastMessage: message,
    timestamp: Date.now()
  });
}
```

---

### 🎯 Strategy 3: Spell Correction

```javascript
// Simple Levenshtein distance
function levenshteinDistance(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Find closest keyword
function correctSpelling(input, keywords) {
  let closest = null;
  let minDistance = Infinity;
  
  for (const keyword of keywords) {
    const distance = levenshteinDistance(input.toLowerCase(), keyword);
    if (distance < minDistance && distance <= 2) { // max 2 char difference
      minDistance = distance;
      closest = keyword;
    }
  }
  
  return closest;
}

// Usage
const input = 'hercut'; // typo
const corrected = correctSpelling(input, ['haircut', 'beard', 'facial']);
// Returns: 'haircut'
```

---

### 🎯 Strategy 4: Confidence Scoring

```javascript
function detectIntentWithConfidence(message) {
  const scores = {};
  
  // Score each intent
  for (const [intent, patterns] of Object.entries(PATTERNS)) {
    let score = 0;
    
    // Exact keyword match: +10 points
    if (patterns.keywords.some(kw => message.includes(kw))) {
      score += 10;
    }
    
    // Variation match: +7 points
    if (patterns.variations.some(v => message.includes(v))) {
      score += 7;
    }
    
    // Related term: +5 points
    if (patterns.related.some(r => message.includes(r))) {
      score += 5;
    }
    
    // Question pattern: +3 points
    if (patterns.questions.some(q => message.includes(q))) {
      score += 3;
    }
    
    scores[intent] = score;
  }
  
  // Get highest score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topIntent, topScore] = sorted[0];
  
  // Only return if confidence > threshold
  if (topScore >= 5) {
    return { intent: topIntent, confidence: topScore / 10 };
  }
  
  return null;
}

// Usage
const result = detectIntentWithConfidence("what's the haircut rate?");
// Returns: { intent: 'haircut', confidence: 1.3 }
```

---

### 🎯 Strategy 5: Multi-Language Support

```javascript
const TRANSLATIONS = {
  'haircut': {
    tamil: ['முடி வெட்டுதல்', 'முடி', 'கட்'],
    hindi: ['बाल काटना', 'हेयर कट'],
    telugu: ['జుట్టు కత్తిరించడం']
  }
};

function detectLanguage(message) {
  // Check if Tamil unicode
  if (/[\u0B80-\u0BFF]/.test(message)) return 'tamil';
  // Check if Hindi unicode
  if (/[\u0900-\u097F]/.test(message)) return 'hindi';
  // Check if Telugu unicode
  if (/[\u0C00-\u0C7F]/.test(message)) return 'telugu';
  
  return 'english';
}

function translateIntent(message) {
  const language = detectLanguage(message);
  
  if (language !== 'english') {
    for (const [intent, translations] of Object.entries(TRANSLATIONS)) {
      if (translations[language]?.some(word => message.includes(word))) {
        return intent;
      }
    }
  }
  
  return null;
}
```

---

## 6. Advanced Features

### 🔄 Session Management

```javascript
class ConversationSession {
  constructor() {
    this.sessions = new Map();
    this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  }
  
  getSession(userId) {
    const session = this.sessions.get(userId);
    
    if (!session || Date.now() - session.lastActivity > this.SESSION_TIMEOUT) {
      return this.createNewSession(userId);
    }
    
    return session;
  }
  
  createNewSession(userId) {
    const session = {
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      context: {},
      messageCount: 0,
      intent: null,
      waitingFor: null
    };
    
    this.sessions.set(userId, session);
    return session;
  }
  
  updateSession(userId, updates) {
    const session = this.getSession(userId);
    Object.assign(session, updates, { lastActivity: Date.now() });
    session.messageCount++;
  }
}

// Usage
const sessionManager = new ConversationSession();

async function handleMessage(from, message) {
  const session = sessionManager.getSession(from);
  
  // Context-aware routing
  if (session.waitingFor === 'appointment_date') {
    return handleAppointmentDate(message, session);
  }
  
  // Normal routing
  const response = await processMessage(message);
  
  // Update session
  sessionManager.updateSession(from, {
    lastIntent: detectIntent(message),
    lastResponse: response
  });
  
  return response;
}
```

---

### 📊 Analytics & Logging

```javascript
class BotAnalytics {
  constructor() {
    this.metrics = {
      totalMessages: 0,
      intentCounts: {},
      averageResponseTime: 0,
      popularQueries: {},
      userRetention: {}
    };
  }
  
  logMessage(userId, message, intent, responseTime) {
    this.metrics.totalMessages++;
    
    // Count intents
    this.metrics.intentCounts[intent] = (this.metrics.intentCounts[intent] || 0) + 1;
    
    // Track popular queries
    const normalized = message.toLowerCase().trim();
    this.metrics.popularQueries[normalized] = (this.metrics.popularQueries[normalized] || 0) + 1;
    
    // Response time
    const currentAvg = this.metrics.averageResponseTime;
    const count = this.metrics.totalMessages;
    this.metrics.averageResponseTime = ((currentAvg * (count - 1)) + responseTime) / count;
    
    // User retention
    if (!this.metrics.userRetention[userId]) {
      this.metrics.userRetention[userId] = {
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        messageCount: 0
      };
    }
    this.metrics.userRetention[userId].lastSeen = Date.now();
    this.metrics.userRetention[userId].messageCount++;
  }
  
  getTopQueries(limit = 10) {
    return Object.entries(this.metrics.popularQueries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }
  
  getMissedIntents() {
    return Object.entries(this.metrics.intentCounts)
      .filter(([intent]) => intent === 'unknown')
      .map(([_, count]) => count);
  }
}

const analytics = new BotAnalytics();

// Usage in webhook
async function processMessage(from, message) {
  const startTime = Date.now();
  const intent = detectIntent(message);
  
  // Process message...
  const response = await generateResponse(intent);
  
  // Log analytics
  const responseTime = Date.now() - startTime;
  analytics.logMessage(from, message, intent, responseTime);
  
  return response;
}
```

---

### 🎫 Template Messages (Pre-approved)

For **proactive** messages (notifications, reminders):

```javascript
// These need WhatsApp Business API approval
const TEMPLATES = {
  appointmentReminder: {
    name: 'appointment_reminder',
    template: `Hi {{1}}, 

This is a reminder for your appointment at McKingstown {{2}} tomorrow at {{3}}.

See you soon! 💇‍♂️`,
    variables: ['customerName', 'outletName', 'time']
  },
  
  promotionAlert: {
    name: 'monthly_offer',
    template: `🎉 Special Offer for {{1}}!

Get {{2}}% off on {{3}} services this weekend.

Book now: {{4}}`
  }
};

// Can only send outside 24-hour window with templates
async function sendPromotion(customerPhone, customerName) {
  await twilioService.sendWhatsAppTemplate(
    customerPhone,
    TEMPLATES.promotionAlert.name,
    [customerName, '20', 'all', 'www.mckingstown.in']
  );
}
```

---

## 7. Best Practices

### ✅ DO's

1. **Keep responses concise**
   ```javascript
   // Good
   "Haircut: ₹75-₹200\nType *menu* for more."
   
   // Bad
   "We offer a wide variety of haircut services ranging from basic cuts to premium styling..."
   ```

2. **Use emojis strategically**
   ```javascript
   // Good - Enhances readability
   "✅ Booking confirmed!\n📍 Tambaram outlet\n⏰ Tomorrow 10 AM"
   
   // Bad - Too many
   "✨💇‍♂️✂️ Haircut ✂️💇‍♂️✨ is ₹75 💰💵💸"
   ```

3. **Provide clear next steps**
   ```javascript
   // Always end with action
   "Type *book* to schedule or *menu* for services."
   ```

4. **Handle errors gracefully**
   ```javascript
   if (!foundOutlet) {
     return "I couldn't find outlets in that city. Try:\n• Chennai\n• Bangalore\n• Coimbatore\n\nOr type *all* to see all cities.";
   }
   ```

5. **Test all flows**
   - Use your FREE test interface
   - Test misspellings
   - Test in different orders
   - Test with numbers vs words

---

### ❌ DON'Ts

1. **Don't send multiple messages rapidly**
   ```javascript
   // Bad
   await send("Hello!");
   await send("Welcome to McKingstown!");
   await send("How can I help you?");
   
   // Good
   await send("Hello! Welcome to McKingstown!\n\nHow can I help you?");
   ```

2. **Don't use huge images**
   - Keep images < 1MB
   - Optimize for mobile
   - Use JPG over PNG

3. **Don't ignore context**
   ```javascript
   // Bad - No context
   if (message === "yes") {
     return "Great!";
   }
   
   // Good - Check context
   if (message === "yes" && session.waitingFor === 'booking_confirm') {
     return confirmBooking(session);
   }
   ```

4. **Don't overuse Dialogflow**
   - Use patterns first (faster, FREE)
   - Dialogflow for complex NLU
   - Cache common responses

---

## 8. Limitations

### WhatsApp API Limits

**Twilio Sandbox:**
- ⏱️ 72-hour session timeout
- 👥 Limited concurrent users
- 📝 Shows "Twilio Sandbox" label
- 🚫 Can't send proactive messages

**WhatsApp Business API (Production):**
- ✅ No session timeout
- ✅ Unlimited users
- ✅ Custom business profile
- ✅ Template messages
- 💰 Costs per conversation

**Rate Limits:**
- 🔢 **Free tier:** 1,000 conversations/month
- 🔢 **After that:** $0.005-0.009 per message (varies by country)
- ⚡ **Speed:** Max 80 messages/second (per number)

**Message Size Limits:**
- 📝 Text: 4,096 characters
- 📷 Image: 5 MB
- 📄 PDF: 100 MB
- 🎥 Video: 16 MB
- 🎵 Audio: 16 MB

---

## 9. Implementation Checklist

### Phase 1: Core Precision ✅
- [x] Comprehensive pattern matching
- [x] City/location detection with suburbs
- [x] Service price responses
- [x] Contact information

### Phase 2: Rich Media 🔄 (In Progress)
- [x] Image support added to twilioService
- [x] Location sharing method added
- [x] Button message format created
- [ ] Upload actual images to server
- [ ] Add coordinates to all outlets
- [ ] Test media sending

### Phase 3: Interactive Elements 📋
- [ ] Implement numbered button responses
- [ ] Add context tracking for button clicks
- [ ] Create list messages for cities
- [ ] Add appointment booking flow with buttons

### Phase 4: Advanced Features 🚀
- [ ] Session management
- [ ] Spell correction
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Conversation logs

### Phase 5: Production Ready 🎯
- [ ] WhatsApp Business API (not sandbox)
- [ ] Template messages approved
- [ ] Webhook SSL certificate
- [ ] Load balancing
- [ ] Error monitoring

---

## 10. Next Steps

### Immediate (Do Now):
1. **Upload media files** to your website:
   ```
   www.mckingstown.in/images/
   ├── price-list.jpg
   ├── haircut-styles.jpg
   ├── beard-styles.jpg
   └── wedding-package.jpg
   ```

2. **Add coordinates to outlets.js**:
   ```javascript
   {
     city: 'Chennai',
     area: 'Tambaram',
     coordinates: { lat: 12.9229, lng: 80.1275 }
   }
   ```

3. **Test media responses**:
   ```javascript
   // In testingWebhook.js
   if (messageTextLower.includes('menu')) {
     const response = ResponseGenerator.getCompleteMenu();
     await twilioService.sendWhatsAppMessageWithMedia(
       From,
       response,
       MEDIA_URLS.servicePriceList
     );
   }
   ```

### Short Term (This Week):
1. Implement button click handling
2. Add spell correction
3. Create appointment booking flow
4. Test all features on Twilio sandbox

### Long Term (This Month):
1. Apply for WhatsApp Business API
2. Get template messages approved
3. Deploy to production server
4. Monitor and optimize

---

## 📞 Support

**Questions?**
- Test everything at: http://localhost:3000/test-chat.html
- Check logs for errors
- Use analytics to find missed intents

**Resources:**
- Twilio Docs: https://www.twilio.com/docs/whatsapp
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp

---

*Last Updated: December 22, 2025*
*Bot Version: 2.0 - Rich Media Edition*
