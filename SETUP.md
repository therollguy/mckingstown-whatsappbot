# 🚀 Quick Setup Guide

## Step 1: Get Your Dialogflow Service Account Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `whatsapp-bot-mckingstown-tyiw`
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Find your service account (or create one with "Dialogflow API Client" role)
5. Click on the service account → **Keys** tab
6. Click **Add Key** → **Create new key** → Select **JSON**
7. Download the JSON file
8. Rename it to `dialogflow-service-account.json`
9. Move it to the `config/` folder in this project

## Step 2: Enable Dialogflow API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Dialogflow API"
3. Click **Enable**

## Step 3: Verify Environment Variables

Check that your `.env` file has all required values:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
DIALOGFLOW_PROJECT_ID=your_project_id_here
GOOGLE_APPLICATION_CREDENTIALS=./config/dialogflow-service-account.json
PORT=3000
NODE_ENV=development
```

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
✅ Server running on port 3000
📱 WhatsApp webhook: http://localhost:3000/webhook/whatsapp
🤖 Dialogflow Project: whatsapp-bot-mckingstown-tyiw
```

## Step 5: Expose Webhook for Testing (Local Development)

### Option A: Using ngrok (Recommended)

1. Install ngrok: https://ngrok.com/download
2. Run:
   ```bash
   ngrok http 3000
   ```
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Option B: Using localhost.run

```bash
ssh -R 80:localhost:3000 nokey@localhost.run
```

## Step 6: Configure Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Click on **Sandbox settings**
4. Under "WHEN A MESSAGE COMES IN", set:
   - URL: `https://your-ngrok-url.ngrok.io/webhook/whatsapp`
   - Method: `HTTP POST`
5. Click **Save**

## Step 7: Test the Bot

1. Join the Twilio Sandbox by sending the join code to `+1 415 523 8886` on WhatsApp
2. Send a test message: "Hello"
3. Check your terminal logs to see the request flow

## 🎯 Next Steps

1. **Create Dialogflow Intents**
   - Haircut Price Intent
   - Service Inquiry Intent
   - Franchise Inquiry Intent
   - Location/City Intent

2. **Add Franchise Routing Logic** (see `/src/services/franchiseService.js` - to be created)

3. **Add Lead Capture to Google Sheets** (see `/src/services/sheetsService.js` - to be created)

4. **Deploy to Production**
   - Heroku / AWS / Azure / GCP
   - Update Twilio webhook to production URL

## 🐛 Common Issues

### "GOOGLE_APPLICATION_CREDENTIALS file not found"
- Make sure `dialogflow-service-account.json` is in the `config/` folder
- Check the path in `.env` is correct

### "Twilio API Error: 20003"
- Your Twilio Auth Token is incorrect
- Double-check the value in `.env`

### "Dialogflow API has not been used in project"
- Enable Dialogflow API in Google Cloud Console
- Wait 1-2 minutes for propagation

### "Webhook timeout"
- Dialogflow response is taking too long
- Check your internet connection
- Verify Dialogflow agent is configured correctly

---

**Questions?** Check the main [README.md](README.md) for detailed documentation.
