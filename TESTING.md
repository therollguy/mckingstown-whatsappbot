# 🧪 Testing Guide - Zero Cost Development

## Problem: Twilio Charges for Testing

Testing on Twilio (even sandbox) can incur costs. Here's how to test **completely FREE** during development.

---

## ✅ **Option 1: Local Test Harness (RECOMMENDED)**

Test your webhook **without Twilio** using the test script.

### Setup:
```bash
# 1. Start your local server
npm start

# 2. In a new terminal, run tests
node test/local-test.js
```

### Benefits:
- ✅ **100% FREE** - No Twilio costs
- ✅ Tests all conversation flows
- ✅ See responses in real-time
- ✅ No internet connection needed (for local testing)

### What it does:
- Sends mock WhatsApp messages to your webhook
- Tests: menu, franchise, pricing, booking, etc.
- Logs bot responses to console

---

## ✅ **Option 2: Development Mode**

Disable Twilio message sending during development.

### Setup:
```bash
# Add to your .env file
DEV_MODE=true
```

### How it works:
- Webhook still receives messages
- Bot generates responses
- **Responses logged to console** instead of sending via Twilio
- ✅ **Zero cost**

### Usage:
```bash
# Enable dev mode
echo "DEV_MODE=true" >> .env

# Start server
npm start

# Test with curl or Postman
curl -X POST http://localhost:10000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=franchise" \
  -d "ProfileName=Test User"
```

---

## ✅ **Option 3: Postman/Thunder Client**

Test webhook directly without WhatsApp.

### Thunder Client (VS Code Extension):
1. Install "Thunder Client" extension
2. Create POST request: `http://localhost:10000/webhook/whatsapp`
3. Body (x-www-form-urlencoded):
   ```
   From: whatsapp:+919876543210
   Body: menu
   ProfileName: Test User
   ```
4. Send request

### Postman:
Same as above, import this collection:

```json
{
  "info": {
    "name": "McKingstown WhatsApp Bot"
  },
  "item": [
    {
      "name": "Test Menu",
      "request": {
        "method": "POST",
        "url": "http://localhost:10000/webhook/whatsapp",
        "body": {
          "mode": "urlencoded",
          "urlencoded": [
            { "key": "From", "value": "whatsapp:+919876543210" },
            { "key": "Body", "value": "menu" },
            { "key": "ProfileName", "value": "Test User" }
          ]
        }
      }
    },
    {
      "name": "Test Franchise",
      "request": {
        "method": "POST",
        "url": "http://localhost:10000/webhook/whatsapp",
        "body": {
          "mode": "urlencoded",
          "urlencoded": [
            { "key": "From", "value": "whatsapp:+919876543210" },
            { "key": "Body", "value": "franchise" },
            { "key": "ProfileName", "value": "Test User" }
          ]
        }
      }
    }
  ]
}
```

---

## ✅ **Option 4: Twilio Sandbox (Limited Free)**

Twilio sandbox is **mostly free** but has limits.

### How to use correctly:
1. **Join sandbox once**: Send `join <sandbox-word>` to +14155238886
2. **Your messages to bot**: FREE
3. **Bot replies to you**: FREE (within limits)
4. **Limit**: ~1000 messages/month free tier

### Where costs come from:
- ❌ Sending messages to numbers NOT in sandbox
- ❌ Production phone numbers (₹1,500+/month)
- ❌ Exceeding free tier limits

---

## 💰 **Cost Comparison**

| Method | Cost | Messages/day | Best For |
|--------|------|--------------|----------|
| **Local Test Script** | ₹0 | Unlimited | Development |
| **DEV_MODE=true** | ₹0 | Unlimited | Development |
| **Postman/Thunder** | ₹0 | Unlimited | API Testing |
| **Twilio Sandbox** | ₹0* | ~30/day | User Testing |
| **Twilio Production** | ₹500+/month | Unlimited | Production |

*Within free tier limits

---

## 🚀 **Recommended Testing Workflow**

### During Development (You):
```bash
# Use local test script - 100% FREE
npm start
node test/local-test.js
```

### Before Deployment:
```bash
# Enable dev mode and test on Render
# Set DEV_MODE=true in Render env vars
# Use Postman to test deployed webhook
```

### For Client Demo:
```bash
# Use Twilio sandbox - mostly free
# Ask 2-3 people to join sandbox and test
```

### Production Launch:
```bash
# Disable dev mode
# Use Twilio production number
# Budget: ~₹500-1000/month for 1000+ messages
```

---

## 📝 **Quick Test Commands**

```bash
# Test locally (FREE)
npm start
node test/local-test.js

# Test with curl (FREE)
curl -X POST http://localhost:10000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=menu"

# Test deployed app (FREE in dev mode)
curl -X POST https://your-app.onrender.com/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=franchise"
```

---

## 🎯 **Summary**

**To completely eliminate testing costs:**
1. Use `node test/local-test.js` for development
2. Set `DEV_MODE=true` in `.env` to disable Twilio sending
3. Use Postman/curl for API testing
4. Only use Twilio sandbox for final user testing (limited free)

**Your ₹30 cost today** was likely from:
- Testing too many messages via actual WhatsApp
- Using production credentials instead of sandbox

**Going forward**: Use the test script above - **100% FREE, unlimited testing!**
