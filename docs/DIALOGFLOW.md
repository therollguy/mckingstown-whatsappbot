# 🤖 Dialogflow Setup Guide

## Overview

This guide walks you through setting up Google Dialogflow for the McKingstown WhatsApp chatbot.

## Prerequisites

- Google Cloud Account (https://console.cloud.google.com/)
- Project created: `whatsapp-bot-mckingstown-tyiw`

---

## 🚀 Quick Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Project name: `whatsapp-bot-mckingstown-tyiw`
4. Click **Create**

### Step 2: Enable Dialogflow API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Dialogflow API"
3. Click on "Dialogflow API"
4. Click **Enable**

### Step 3: Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Service account name: `dialogflow-client`
4. Click **Create and Continue**
5. Role: Select **Dialogflow API Client**
6. Click **Continue** → **Done**

### Step 4: Generate JSON Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Key type: **JSON**
5. Click **Create**
6. Save the downloaded JSON file as `dialogflow-service-account.json`
7. Move it to: `config/dialogflow-service-account.json` in this project

### Step 5: Create Dialogflow Agent

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Click **Create Agent**
3. Agent name: `McKingstown-Chatbot`
4. Default language: **English**
5. Default time zone: **Asia/Kolkata**
6. Google project: Select `whatsapp-bot-mckingstown-tyiw`
7. Click **Create**

---

## 🎯 Creating Intents

### Intent 1: Welcome Intent (Default)

**Already exists by default. Customize it:**

**Training Phrases:**
- Hello
- Hi
- Hey
- Good morning
- Hi there

**Responses:**
```
Hello! Welcome to McKingstown Barbershop. 👋

I can help you with:
• Haircut prices
• Service information
• Timing and location
• Appointment booking
• Franchise inquiries

How can I assist you today?
```

---

### Intent 2: Haircut Price Intent

**Intent name:** `customer.service.haircut.price`

**Training Phrases:**
- What is the haircut price?
- How much for a haircut?
- Haircut cost?
- Price of haircut
- How much does a haircut cost?
- What do you charge for haircut?
- Tell me haircut price
- Haircut rate
- How much for hair cutting?
- What's your haircut pricing?

**Responses:**
```
Our haircut prices are:

✂️ **Standard Haircut**: ₹250
✂️ **Premium Haircut**: ₹400
✂️ **Kids Haircut**: ₹150

Prices may vary slightly by location. Would you like to know about other services?
```

**Action name:** `get.haircut.price`

---

### Intent 3: Beard Service Intent

**Intent name:** `customer.service.beard`

**Training Phrases:**
- Beard service price
- How much for beard trim?
- Beard grooming cost
- What's the beard service rate?
- Price for beard styling
- Beard trim price
- Tell me about beard services
- Beard service rates

**Responses:**
```
Our beard services:

🧔 **Beard Trim**: ₹150
🧔 **Beard Styling**: ₹200
🧔 **Beard Color**: ₹300
🧔 **Full Beard Grooming**: ₹350

Would you like to book an appointment?
```

**Action name:** `get.beard.price`

---

### Intent 4: Facial Service Intent

**Intent name:** `customer.service.facial`

**Training Phrases:**
- Facial price
- How much for facial?
- Tell me about facial services
- Facial service cost
- What facial services do you offer?
- Price for facial treatment

**Responses:**
```
Our facial services:

✨ **Basic Facial**: ₹400
✨ **Deep Cleansing Facial**: ₹600
✨ **Anti-Aging Facial**: ₹800
✨ **Gold Facial**: ₹1200

All facials include complimentary head massage. Interested in booking?
```

**Action name:** `get.facial.price`

---

### Intent 5: Timing/Hours Intent

**Intent name:** `customer.info.timing`

**Training Phrases:**
- What are your timings?
- When are you open?
- Opening hours
- What time do you open?
- What time do you close?
- Are you open on Sunday?
- Working hours

**Responses:**
```
📅 **Working Hours:**

Monday - Saturday: 9:00 AM - 9:00 PM
Sunday: 10:00 AM - 8:00 PM

We're open all days of the week!

Would you like to know about our location or book an appointment?
```

**Action name:** `get.timing`

---

### Intent 6: Location/Outlet Intent

**Intent name:** `customer.info.location`

**Training Phrases:**
- Where is your outlet?
- Store location
- Nearest branch
- Where are you located?
- Address please
- How to reach you?
- Find outlet near me
- Which locations do you have?

**Responses:**
```
We have 100+ outlets across India! 🇮🇳

To find the nearest outlet, please share your city name.

For example: "I'm in Chennai" or "Find outlet in Mumbai"
```

**Action name:** `get.location`

---

### Intent 7: Appointment Booking Intent

**Intent name:** `customer.appointment.book`

**Training Phrases:**
- I want to book an appointment
- Book appointment
- Can I schedule a haircut?
- Reserve a slot
- I need an appointment
- Book a time slot
- Schedule appointment for tomorrow

**Responses:**
```
I'd be happy to help you book an appointment! 📅

Please share:
1. Your preferred date (e.g., tomorrow, Dec 25)
2. Preferred time (e.g., 3 PM)
3. Service type (haircut, facial, beard, etc.)
4. Your nearest outlet or area

You can also call our outlet directly for instant booking.
```

**Action name:** `book.appointment`

---

### Intent 8: Franchise Inquiry Intent (IMPORTANT)

**Intent name:** `business.franchise.inquiry`

**Training Phrases:**
- I want franchise
- How to open McKingstown outlet?
- Franchise opportunity
- I want to start a franchise
- Interested in franchise
- How can I get franchise?
- Partner with you
- Open outlet in my city
- Franchise details
- Business partnership inquiry

**Responses:**
```
Thank you for your interest in McKingstown franchise! 🤝

To connect you with the right person, could you please share:

📍 Your **city** and **state**?

For example: "I'm from Chennai, Tamil Nadu"
```

**Action name:** `franchise.inquiry`

**Follow-up Intent:** Create `business.franchise.inquiry - location` to capture the city/state.

---

### Intent 9: Franchise Location Follow-up Intent

**Intent name:** `business.franchise.inquiry - location`

**Contexts:**
- Input context: `franchise-inquiry-followup`
- Output context: `franchise-location-captured`

**Training Phrases (with @sys.geo-city and @sys.geo-state entities):**
- I'm from @sys.geo-city, @sys.geo-state
- @sys.geo-city, @sys.geo-state
- My location is @sys.geo-city
- @sys.geo-city

**Enable Webhook Fulfillment:**
- ✅ Enable webhook call for this intent

**Webhook Response (Backend will handle this):**
```
Thank you! I've noted your interest from {city}, {state}.

Our franchise officer for your region is:

👤 **{Officer Name}**
📱 WhatsApp: +91 {Officer Phone}

Please reach out to them directly for franchise details, investment, and process. They'll be happy to guide you!

Your lead has been recorded. 📝
```

---

## 🔗 Enable Webhook Integration

### Step 1: Enable Fulfillment

1. In Dialogflow Console, click **Fulfillment** in left menu
2. **Enable Webhook**
3. URL: `https://your-domain.com/webhook/dialogflow` (we'll create this endpoint)
4. Click **Save**

### Step 2: Enable Webhook for Specific Intents

For intents that need backend logic (franchise routing, dynamic pricing):
1. Open the intent
2. Scroll to **Fulfillment** section
3. Check ✅ **Enable webhook call for this intent**
4. Click **Save**

**Intents to enable webhook for:**
- `business.franchise.inquiry - location` (for franchise routing)
- `customer.service.haircut.price` (optional: for dynamic pricing)
- `customer.service.beard` (optional)
- `customer.service.facial` (optional)

---

## 📝 Testing in Dialogflow Console

### Test 1: Welcome Intent
- Input: "Hello"
- Expected: Welcome message with options

### Test 2: Haircut Price
- Input: "What is haircut price?"
- Expected: Price list with haircut options

### Test 3: Franchise Inquiry
- Input: "I want franchise"
- Expected: Ask for city/state
- Follow-up: "Chennai, Tamil Nadu"
- Expected: Franchise officer details (via webhook)

---

## 🌐 Language Support (Optional)

To add Tamil or Hindi support:

1. In Dialogflow Console, click on your agent name → **Settings** → **Languages**
2. Click **Add Additional Language**
3. Select **Tamil** or **Hindi**
4. Create training phrases in that language
5. Add responses in that language

Example (Tamil):
```
Training Phrase: "முடிவெட்டு விலை என்ன?"
Response: "எங்கள் முடிவெட்டு விலை ₹250 முதல் ₹400 வரை"
```

---

## 🔧 Advanced Settings

### Enable Small Talk
1. Go to **Small Talk** in left menu
2. Enable it
3. Customize responses for common questions like:
   - "What's your name?"
   - "How are you?"
   - "Thank you"

### Enable Sentiment Analysis
1. Go to **Settings** → **ML Settings**
2. Enable **Sentiment Analysis**
3. This helps understand customer emotions

### Set Session Timeout
1. Go to **Settings** → **ML Settings**
2. **Session timeout**: Set to **10 minutes**
3. This controls how long context is maintained

---

## 🐛 Troubleshooting

### "Agent not responding"
- Check if Dialogflow API is enabled
- Verify service account has correct permissions
- Test in Dialogflow console first

### "Webhook call failed"
- Verify webhook URL is accessible (use ngrok for local testing)
- Check backend logs for errors
- Ensure backend responds within 5 seconds

### "Intent not detected"
- Add more training phrases (minimum 10 per intent)
- Use varied phrasings
- Retrain the agent

### "Low confidence score"
- Intent confidence < 0.7 means ambiguous
- Add more training phrases
- Make intents more distinct

---

## 📊 Analytics & Monitoring

### View Analytics
1. Go to **Analytics** in Dialogflow Console
2. Monitor:
   - Total queries
   - Intent detection rate
   - Fallback rate (should be < 10%)

### Export Training Data
1. Go to **Settings** → **Export and Import**
2. **Export as ZIP** to backup your agent

---

## 📚 Resources

- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Dialogflow Console](https://dialogflow.cloud.google.com/)
- [Dialogflow Training Best Practices](https://cloud.google.com/dialogflow/docs/best-practices)

---

**Next Steps:**
1. ✅ Complete backend webhook for franchise routing
2. ✅ Test end-to-end with WhatsApp
3. ✅ Add more intents as needed
