# 💰 **Zero Cost Testing - Quick Start**

## Problem Today
❌ You spent **₹30** testing on Twilio WhatsApp

## Solution: Test for FREE
✅ Use these methods - **₹0 cost, unlimited testing**

---

## **Method 1: Local Test Script** (Best for Development)

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Run FREE tests
npm test
```

**What happens:**
- Tests all conversation flows (menu, franchise, prices, etc.)
- Shows bot responses in console
- ✅ **100% FREE - No Twilio charges**

---

## **Method 2: DEV_MODE** (Disable Twilio Sending)

```bash
# Edit .env file - add this line:
DEV_MODE=true

# Start server
npm start

# Test with curl (or Postman)
curl -X POST http://localhost:10000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=menu"
```

**What happens:**
- Bot processes messages normally
- Responses logged to console (NOT sent via Twilio)
- ✅ **100% FREE - No Twilio charges**

---

## **Method 3: Twilio Sandbox** (For Real WhatsApp Testing)

**Free Limits**: ~1000 messages/month

**How to use:**
1. Send `join <your-sandbox-code>` to +14155238886 (one-time)
2. Chat normally - FREE within limits
3. ⚠️ Don't exceed ~30 messages/day to avoid charges

**Where costs came from today:**
- Probably exceeded free tier limits
- Or using production number instead of sandbox

---

## **💡 Recommendation**

### During Development (Daily)
```bash
npm test  # FREE, unlimited
```

### Before Deploying (Weekly)
```bash
# Set DEV_MODE=true on Render
# Test with Postman - FREE
```

### Client Demo (Once)
```bash
# Use Twilio sandbox - mostly FREE
# Invite 2-3 testers to sandbox
```

---

## **🎯 Summary**

**To eliminate testing costs:**
1. **Use `npm test`** - completely FREE, tests everything
2. **Enable DEV_MODE** - disables Twilio sending
3. **Only use WhatsApp sandbox** when you need real WhatsApp testing

**From now on**: Run `npm test` for daily development - **₹0 cost! 🎉**

---

## Need Help?

See [TESTING.md](TESTING.md) for detailed instructions.
