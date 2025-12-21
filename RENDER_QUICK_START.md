# ⚡ Render.com Quick Deploy Guide

## 🎯 Step-by-Step (5 Minutes)

### 1. Create Render Account
→ https://render.com/ → Sign up with GitHub

### 2. Create Web Service
- Click **New +** → **Web Service**
- Select repo: `therollguy/mckingstown-whatsappbot`
- Click **Connect**

### 3. Basic Config
```
Name: mckingstown-whatsapp-bot
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free (or Starter for production)
```

### 4. Add Environment Variables

**⚠️ IMPORTANT: Use your ACTUAL credentials, not placeholders!**

Go to Render Dashboard → Your Service → Environment

**Required (click "Add Environment Variable" for each):**
```env
NODE_ENV=production
PORT=10000
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
DIALOGFLOW_PROJECT_ID=whatsapp-bot-mckingstown-tyiw
```

**⚠️ Your Twilio Account SID MUST start with "AC"**

Find your credentials at: https://console.twilio.com/

### 5. Add Dialogflow Credentials (IMPORTANT!)

**Convert JSON to Base64:**

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("config/dialogflow-service-account.json"))
```

**Linux/Mac:**
```bash
base64 config/dialogflow-service-account.json
```

**Add to Render:**
```
Key: GOOGLE_CREDENTIALS_BASE64
Value: (paste Base64 string)
```

### 6. Deploy
Click **Create Web Service** → Wait 2-3 minutes

### 7. Get Your URL
```
https://mckingstown-whatsapp-bot.onrender.com
```

### 8. Update Webhooks

**Twilio:**
- Go to: https://console.twilio.com/
- Messaging → WhatsApp Sandbox
- Webhook: `https://mckingstown-whatsapp-bot.onrender.com/webhook/whatsapp`

**Dialogflow:**
- Go to: https://dialogflow.cloud.google.com/
- Fulfillment → Webhook
- URL: `https://mckingstown-whatsapp-bot.onrender.com/webhook/dialogflow`

---

## ✅ Verify Deployment

### Test Health Check
```bash
curl https://mckingstown-whatsapp-bot.onrender.com/
```

Expected response:
```json
{
  "status": "online",
  "service": "McKingstown WhatsApp Bot",
  "timestamp": "..."
}
```

### Test WhatsApp
1. Send "Hello" to `+1 415 523 8886`
2. Should get welcome message

---

## 🐛 Common Issues

### "accountSid must start with AC"
→ **TWILIO_ACCOUNT_SID not set correctly in Render**
→ Go to: Render Dashboard → Your Service → Environment
→ Add: Key=`TWILIO_ACCOUNT_SID`, Value=`your_actual_account_sid`
→ Click "Save Changes" and redeploy

### "Application failed to start"
→ Check logs in Render dashboard
→ Verify ALL environment variables are set (not just added)
→ Make sure to click "Save Changes" after adding variables

### "Google credentials error"
→ Make sure Base64 string is correct
→ No line breaks in Base64 value
→ Paste the entire Base64 output

### "Port already in use"
→ Render uses PORT=10000 (already configured)

---

## 💰 Pricing

**Free Tier:**
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 min inactivity
- Good for: Testing

**Starter ($7/month):**
- ✅ Always on
- ✅ Better performance
- Good for: Production

---

## 📊 Keep Free Tier Awake

Use UptimeRobot:
1. Sign up: https://uptimerobot.com/
2. Add Monitor:
   - URL: `https://mckingstown-whatsapp-bot.onrender.com/`
   - Interval: 10 minutes
3. Free tier won't sleep anymore! ✅

---

## 🔄 Auto-Deploy

Push to GitHub = Auto-deploy to Render!

```bash
git add .
git commit -m "Update code"
git push origin master
# Render auto-deploys! 🚀
```

---

**Full Guide:** See [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md)

---

## 📞 Your URLs After Deploy

- **App:** `https://mckingstown-whatsapp-bot.onrender.com`
- **WhatsApp Webhook:** `https://mckingstown-whatsapp-bot.onrender.com/webhook/whatsapp`
- **Dialogflow Webhook:** `https://mckingstown-whatsapp-bot.onrender.com/webhook/dialogflow`
- **Logs:** Render Dashboard → Your Service → Logs

---

**Ready to Deploy? Go to:** https://render.com/ 🚀
