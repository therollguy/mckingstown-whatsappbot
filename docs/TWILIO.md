# 📱 Twilio WhatsApp Setup Guide

## Overview

This guide walks you through setting up Twilio WhatsApp integration for the McKingstown chatbot.

## Prerequisites

- Twilio Account (sign up at https://www.twilio.com/try-twilio)
- WhatsApp Business Profile (for production)

---

## 🧪 Development Setup (Sandbox)

### Step 1: Access Twilio WhatsApp Sandbox

1. Log in to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. You'll see your sandbox number: `+1 (415) 523-8886`
4. Note your join code (e.g., "join <word>-<word>")

### Step 2: Join the Sandbox

1. Open WhatsApp on your phone
2. Send a message to: `+1 (415) 523-8886`
3. Message text: `join <your-join-code>`
4. You'll receive a confirmation message

### Step 3: Configure Webhook

1. In Twilio Console, go to **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
2. Under **"WHEN A MESSAGE COMES IN"**:
   - URL: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`
   - Method: `HTTP POST`
3. Click **Save**

### Step 4: Get Your Credentials

Your credentials are already in `.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**To find them manually:**
1. Go to Twilio Console → Dashboard
2. **Account SID** and **Auth Token** are displayed on the main dashboard
3. **WhatsApp From number** is in WhatsApp Sandbox settings

---

## 🚀 Production Setup (WhatsApp Business API)

### Requirements

- Registered business
- Facebook Business Manager account
- Website
- Business verification documents

### Step 1: Request Access to WhatsApp Business API

1. Go to Twilio Console → **Messaging** → **WhatsApp**
2. Click **Request Access**
3. Fill out the application form
4. Wait for approval (typically 1-3 business days)

### Step 2: Submit Your Sender Profile

You'll need to provide:
- **Business Name**: McKingstown Barbershop
- **Business Description**: Barbershop chain with 100+ outlets
- **Business Website**: https://www.mckingstown.com
- **Business Category**: Beauty/Personal Care
- **Business Address**: Your registered address
- **Contact Email**: support@mckingstown.com

### Step 3: Facebook Business Verification

1. Link your Facebook Business Manager account
2. Upload business documents (registration certificate, tax ID, etc.)
3. Wait for verification (5-10 business days)

### Step 4: Configure WhatsApp Number

Once approved:
1. Choose your WhatsApp business number
2. Port an existing number OR get a new Twilio number
3. Complete phone number verification

### Step 5: Get Blue Tick Verification

1. Complete all business profile information
2. Upload business logo and cover photo
3. Submit for official business account verification
4. Wait for Meta approval (additional 5-7 days)

### Step 6: Update Webhook URL

1. In Twilio Console, go to **Messaging** → **WhatsApp** → **Senders**
2. Click on your production sender
3. Set webhook URL to your production server:
   - URL: `https://api.mckingstown.com/webhook/whatsapp`
   - Method: `HTTP POST`

### Step 7: Update Environment Variables

Replace sandbox credentials with production credentials:

```env
TWILIO_ACCOUNT_SID=your_production_account_sid
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+919876543210  # Your production number
```

---

## 💰 Pricing

### Sandbox (Development)
- **FREE** for testing
- Limited to 100 messages per day
- Only works with numbers that join your sandbox

### Production (WhatsApp Business API)
- **Conversation-based pricing** (not per message)
- **User-initiated conversations**: ~₹0.30-0.50 per conversation
- **Business-initiated conversations**: ~₹0.50-0.80 per conversation
- **Free tier**: First 1,000 conversations per month (varies by region)

**Conversation = 24-hour window** of messaging between business and customer.

### Example Cost Calculation

If you have 1,000 customers per month:
- 500 user-initiated (customers asking questions): ₹150-250
- 200 business-initiated (follow-ups): ₹100-160
- **Total estimated cost**: ₹250-410 per month

---

## 🔧 Webhook Configuration

### Webhook URL Format

```
https://your-domain.com/webhook/whatsapp
```

### Webhook Security (Optional but Recommended)

Verify requests are from Twilio by validating the signature:

```javascript
const twilio = require('twilio');

// In your webhook route
router.post('/whatsapp', (req, res, next) => {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `https://your-domain.com${req.originalUrl}`;
  
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  );
  
  if (!isValid) {
    return res.status(403).send('Forbidden');
  }
  
  next();
});
```

---

## 🧪 Testing Your Integration

### Test 1: Echo Bot

Send a message to your WhatsApp sandbox. You should see:
1. Message logged in your terminal
2. Request sent to Dialogflow
3. Response sent back to WhatsApp

### Test 2: cURL Test

```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=Hello" \
  -d "ProfileName=Test User"
```

### Test 3: Production Smoke Test

Once in production:
1. Send "Hello" from a customer's WhatsApp
2. Check logs for proper flow
3. Verify response is received
4. Confirm lead is saved (for franchise inquiries)

---

## 🐛 Troubleshooting

### "Webhook timeout"
- Your server must respond within 10 seconds
- Check Dialogflow response time
- Optimize your webhook logic

### "Permission denied" errors
- Verify Auth Token is correct
- Check Account SID matches
- Ensure sender number is correct

### "Message not delivered"
- Verify recipient has WhatsApp installed
- Check recipient's number format (include country code)
- Ensure recipient has joined sandbox (for testing)

### "Rate limit exceeded"
- Sandbox has 100 message/day limit
- Upgrade to production for higher limits
- Implement rate limiting in your backend

---

## 📚 Resources

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)
- [Twilio Console](https://console.twilio.com/)
- [Twilio Pricing](https://www.twilio.com/whatsapp/pricing)

---

**Next Steps:**
1. ✅ Complete Dialogflow setup → See [DIALOGFLOW.md](DIALOGFLOW.md)
2. ✅ Add franchise routing → See main [README.md](README.md)
3. ✅ Deploy to production → See [DEPLOYMENT.md](DEPLOYMENT.md)
