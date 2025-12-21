# 🚀 Quick Start Guide

## ⚡ Get Up and Running in 10 Minutes

---

## ✅ What's Already Done

You have a **complete, production-ready** backend system with:
- ✅ Twilio WhatsApp integration
- ✅ Dialogflow AI integration
- ✅ Franchise routing for 10 states
- ✅ Google Sheets lead capture
- ✅ All documentation & guides

---

## 🎯 3 Steps to Launch

### Step 1: Get Dialogflow Service Account Key (5 min)

1. Go to: https://console.cloud.google.com/
2. Select project: `whatsapp-bot-mckingstown-tyiw`
3. Navigate: **IAM & Admin** → **Service Accounts**
4. Create service account with role: **Dialogflow API Client**
5. Generate **JSON key**
6. Save as: `config/dialogflow-service-account.json`

**Enable API:**
- Go to **APIs & Services** → **Library**
- Search "Dialogflow API" → Click **Enable**

---

### Step 2: Create Dialogflow Agent (2 hours)

Follow the detailed guide: [docs/DIALOGFLOW.md](docs/DIALOGFLOW.md)

**Quick version:**
1. Go to: https://dialogflow.cloud.google.com/
2. Create agent: "McKingstown-Chatbot"
3. Create 9 intents (copy from docs/DIALOGFLOW.md):
   - Welcome
   - Haircut Price
   - Beard Service
   - Facial Service
   - Timing
   - Location
   - Appointment
   - Franchise Inquiry
   - Franchise Location (with webhook)
4. Enable webhook for franchise location intent
5. Webhook URL: `https://your-domain.com/webhook/dialogflow`

---

### Step 3: Test Locally with ngrok (3 min)

```bash
# Terminal 1: Start server
npm start

# Terminal 2: Expose with ngrok
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Configure Twilio Webhook:**
1. Go to: https://console.twilio.com/
2. **Messaging** → **WhatsApp Sandbox**
3. Webhook URL: `https://abc123.ngrok.io/webhook/whatsapp`
4. Method: **POST**
5. Click **Save**

**Join Sandbox & Test:**
1. Send to `+1 415 523 8886` on WhatsApp
2. Text: `join <your-code>` (shown in Twilio console)
3. Test messages:
   - "Hello"
   - "What is haircut price?"
   - "I want franchise"
   - "Chennai"

---

## 🎉 You're Live!

If you receive responses, **congratulations!** 🎊

Your WhatsApp bot is working end-to-end:
- ✅ WhatsApp → Twilio → Your backend
- ✅ Backend → Dialogflow → AI response
- ✅ Franchise routing → Officer assignment
- ✅ Lead capture → Google Sheets (if configured)

---

## 🚀 Deploy to Production

When you're ready for real users:

**Option 1: Heroku (Easiest)**
```bash
heroku create mckingstown-bot
heroku config:set TWILIO_ACCOUNT_SID=...
heroku config:set TWILIO_AUTH_TOKEN=...
heroku config:set DIALOGFLOW_PROJECT_ID=...
git push heroku main
```

**Option 2: AWS / Azure / GCP**
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed guides.

---

## 📊 Optional: Google Sheets Lead Capture

Follow [docs/GOOGLE_SHEETS.md](docs/GOOGLE_SHEETS.md):

1. Create Google Sheet with 2 tabs:
   - `Franchise Leads`
   - `Customer Inquiries`
2. Share with service account email (from JSON key)
3. Add Sheet ID to `.env`
4. Test: `node test-sheets.js`

**If skipped:** Leads save to local JSON files automatically.

---

## 🐛 Troubleshooting

### "Dialogflow error"
- Check service account key is in `config/` folder
- Verify Dialogflow API is enabled
- Confirm project ID matches

### "Twilio webhook timeout"
- Check server is running: `npm start`
- Verify ngrok is active
- Confirm webhook URL in Twilio is correct

### "Intent not detected"
- Ensure Dialogflow agent is trained
- Add more training phrases
- Check intent names match

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Complete system documentation |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [docs/TWILIO.md](docs/TWILIO.md) | Twilio sandbox & production setup |
| [docs/DIALOGFLOW.md](docs/DIALOGFLOW.md) | All intents with training phrases |
| [docs/GOOGLE_SHEETS.md](docs/GOOGLE_SHEETS.md) | Lead capture setup |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design & flow |
| [docs/CLIENT_PROPOSAL.md](docs/CLIENT_PROPOSAL.md) | Client proposal template |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete project overview |

---

## 💡 Tips

### Development
- Use `npm run dev` for auto-reload during development
- Check logs for debugging
- Test each intent separately in Dialogflow console first

### Production
- Use environment variables for all secrets
- Enable HTTPS (required for webhooks)
- Set up monitoring (UptimeRobot)
- Configure backups for Google Sheets

### Testing
```bash
# Test environment
node test-env.js

# Test franchise routing
node test-franchise.js

# Test Google Sheets
node test-sheets.js

# Test webhook locally
curl -X POST http://localhost:3000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=Hello"
```

---

## 🎓 Learning Path

**Day 1: Setup**
- Get Dialogflow key
- Create intents
- Test locally

**Day 2: Integration**
- Connect to Twilio sandbox
- Test conversations
- Fine-tune responses

**Day 3: Production**
- Apply for WhatsApp Business API
- Deploy to Heroku/AWS
- Update webhook URLs
- Monitor & optimize

---

## 📞 Support Checklist

Before asking for help:
- [ ] Environment variables set correctly (`node test-env.js`)
- [ ] Dialogflow service account key exists
- [ ] Server starts without errors (`npm start`)
- [ ] ngrok is running and URL is correct
- [ ] Twilio webhook is configured
- [ ] Dialogflow agent has intents created

---

## ✅ Success Checklist

You're ready when:
- [ ] Server starts: ✅
- [ ] Environment test passes: ✅
- [ ] Franchise routing works: ✅
- [ ] Dialogflow agent created: ⏳
- [ ] Twilio sandbox joined: ⏳
- [ ] Test conversation works: ⏳
- [ ] Leads saved to sheets/files: ⏳

---

## 🚀 Next Level Features

After basic setup, consider:
- Admin panel for editing prices
- Multi-language support (Tamil, Hindi)
- Analytics dashboard
- CRM integration
- Appointment booking system

See [docs/CLIENT_PROPOSAL.md](docs/CLIENT_PROPOSAL.md) for pricing.

---

**Need help? All guides include troubleshooting sections!**

Start with: [SETUP.md](SETUP.md) → [docs/DIALOGFLOW.md](docs/DIALOGFLOW.md) → [docs/TWILIO.md](docs/TWILIO.md)

**Happy Building! 🎉**
