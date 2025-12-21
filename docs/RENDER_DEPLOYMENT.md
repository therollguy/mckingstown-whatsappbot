# 🚀 Deploy to Render.com

## Overview

Deploy your McKingstown WhatsApp bot to Render.com with automatic deployments from GitHub.

**Why Render.com?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ Easy environment variable management
- ✅ No credit card required for free tier

---

## 📋 Prerequisites

- [x] GitHub repository pushed (already done ✅)
- [ ] Render.com account (free)
- [ ] Dialogflow service account JSON key
- [ ] Twilio credentials

---

## 🚀 Deployment Steps

### Step 1: Create Render.com Account

1. Go to https://render.com/
2. Click **Get Started** or **Sign Up**
3. Sign up with GitHub (recommended) or email
4. Verify your email

---

### Step 2: Create New Web Service

1. Click **New +** button (top right)
2. Select **Web Service**
3. Connect your GitHub account if not already connected
4. Select repository: `therollguy/mckingstown-whatsappbot`
5. Click **Connect**

---

### Step 3: Configure Service

Fill in the following settings:

#### Basic Settings
- **Name**: `mckingstown-whatsapp-bot`
- **Region**: Choose closest to your users (e.g., Singapore for India)
- **Branch**: `master`
- **Root Directory**: (leave blank)
- **Runtime**: `Node`

#### Build & Deploy Settings
- **Build Command**: 
  ```bash
  npm install
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

#### Plan
- **Instance Type**: `Free` (for testing) or `Starter` ($7/month for production)

---

### Step 4: Add Environment Variables

Click **Advanced** → **Add Environment Variable** and add these:

#### Required Variables

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render uses port 10000 |
| `TWILIO_ACCOUNT_SID` | `your_twilio_sid` | From Twilio Console |
| `TWILIO_AUTH_TOKEN` | `your_twilio_token` | From Twilio Console |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` | Your Twilio number |
| `DIALOGFLOW_PROJECT_ID` | `whatsapp-bot-mckingstown-tyiw` | Your Dialogflow project |

#### Optional Variables

| Key | Value | Notes |
|-----|-------|-------|
| `GOOGLE_SHEET_ID` | `your_sheet_id` | For lead capture (optional) |

---

### Step 5: Add Dialogflow Service Account (Important!)

Since Render doesn't support file uploads, we'll use **Base64 encoding**:

#### Option A: Base64 Environment Variable (Recommended)

1. **Encode your JSON key to Base64:**

   **On Windows PowerShell:**
   ```powershell
   [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("config/dialogflow-service-account.json"))
   ```

   **On Linux/Mac:**
   ```bash
   base64 config/dialogflow-service-account.json
   ```

2. **Copy the Base64 string**

3. **Add to Render environment variables:**
   - Key: `GOOGLE_CREDENTIALS_BASE64`
   - Value: (paste the Base64 string)

4. **Update code to decode** (already prepared in your service):

   We need to modify `dialogflowService.js` to handle Base64:

---

### Step 6: Click "Create Web Service"

Render will:
1. Clone your repository
2. Run `npm install`
3. Start your server with `npm start`
4. Assign a URL like: `https://mckingstown-whatsapp-bot.onrender.com`

**Wait 2-3 minutes for deployment to complete.**

---

### Step 7: Verify Deployment

1. Check the deployment logs in Render dashboard
2. Look for:
   ```
   ✅ Server running on port 10000
   📱 WhatsApp webhook: https://...
   🤖 Dialogflow Project: ...
   ```

3. Test the health endpoint:
   ```
   https://mckingstown-whatsapp-bot.onrender.com/
   ```
   Should return:
   ```json
   {
     "status": "online",
     "service": "McKingstown WhatsApp Bot",
     "timestamp": "..."
   }
   ```

---

### Step 8: Update Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **WhatsApp** → **Sandbox Settings**
3. Update webhook URL to:
   ```
   https://mckingstown-whatsapp-bot.onrender.com/webhook/whatsapp
   ```
4. Method: `HTTP POST`
5. Click **Save**

---

### Step 9: Update Dialogflow Webhook

1. Go to [Dialogflow Console](https://dialogflow.cloud.google.com/)
2. Select your agent: `McKingstown-Chatbot`
3. Click **Fulfillment** in left menu
4. Enable **Webhook**
5. URL:
   ```
   https://mckingstown-whatsapp-bot.onrender.com/webhook/dialogflow
   ```
6. Click **Save**

---

## 🎯 Testing Your Deployment

### Test 1: Health Check
```bash
curl https://mckingstown-whatsapp-bot.onrender.com/
```

### Test 2: WhatsApp Message
1. Send message to Twilio sandbox: `+1 415 523 8886`
2. Text: "Hello"
3. Should receive automated response

### Test 3: Franchise Inquiry
1. Send: "I want franchise"
2. Reply with: "Chennai"
3. Should receive officer contact details

---

## 🔧 Updating Dialogflow Service for Base64

Add this to `src/services/dialogflowService.js` at the beginning of the constructor:

```javascript
constructor() {
  this.projectId = process.env.DIALOGFLOW_PROJECT_ID;
  
  // Validate required environment variables
  if (!this.projectId) {
    throw new Error('DIALOGFLOW_PROJECT_ID is not set');
  }

  // Handle Base64 encoded credentials (for Render.com)
  if (process.env.GOOGLE_CREDENTIALS_BASE64) {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString()
    );
    
    this.sessionClient = new dialogflow.SessionsClient({
      credentials: credentials
    });
    
    console.log('✅ Dialogflow service initialized (Base64 credentials)');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    this.sessionClient = new dialogflow.SessionsClient();
    console.log('✅ Dialogflow service initialized (JSON file)');
  } else {
    throw new Error('No Google credentials provided');
  }
  
  console.log(`   Project ID: ${this.projectId}`);
}
```

---

## 💰 Render.com Pricing

### Free Tier
- ✅ 750 hours/month (enough for 1 app running 24/7)
- ✅ Automatic HTTPS
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ 512 MB RAM

**Good for: Testing and low-traffic apps**

### Starter Tier ($7/month)
- ✅ Always on (no sleep)
- ✅ 512 MB RAM
- ✅ Custom domains
- ✅ Better for production

**Good for: Production use**

---

## 🔄 Automatic Deployments

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update webhook logic"
git push origin master

# Render will automatically:
# 1. Pull latest code
# 2. Run npm install
# 3. Restart server
```

---

## 📊 Monitoring

### View Logs
1. Go to Render Dashboard
2. Click on your service
3. Click **Logs** tab
4. See real-time logs

### Health Check
Render automatically monitors your `/` endpoint.
If it's down, you'll get email notifications.

---

## 🐛 Troubleshooting

### "Application failed to start"

**Check Logs:**
1. Click **Logs** in Render dashboard
2. Look for error messages

**Common Issues:**
- Missing environment variables
- Invalid Base64 credentials
- Port mismatch (should be 10000)

### "GOOGLE_APPLICATION_CREDENTIALS not found"

Make sure you:
1. Encoded the JSON key to Base64
2. Added `GOOGLE_CREDENTIALS_BASE64` environment variable
3. Updated `dialogflowService.js` to decode Base64

### "Service is sleeping"

Free tier sleeps after 15 minutes of inactivity.

**Solutions:**
1. Upgrade to Starter tier ($7/month)
2. Use UptimeRobot to ping every 10 minutes:
   - URL: `https://mckingstown-whatsapp-bot.onrender.com/`
   - Interval: 10 minutes

### "Webhook timeout"

Free tier has limited resources.

**Solutions:**
1. Optimize code (already done)
2. Upgrade to Starter tier
3. Check Dialogflow response time

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit credentials to Git
- ✅ Use Render's environment variable manager
- ✅ Rotate credentials regularly

### HTTPS
- ✅ Render provides automatic HTTPS
- ✅ No certificate setup needed

### Secrets Management
- Store all secrets in Render environment variables
- Don't log sensitive data

---

## 📈 Scaling

### When to Upgrade

**Upgrade to Starter when:**
- You have consistent traffic
- Free tier sleeps too often
- Need custom domain
- Need more RAM

### When to Add More Instances

**Add multiple instances when:**
- Handling > 1000 messages/hour
- Need high availability
- Multiple concurrent conversations

---

## 🔄 Rollback

If deployment fails:

1. Go to Render Dashboard
2. Click **Manual Deploy**
3. Select previous working commit
4. Click **Deploy**

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables added
- [ ] Base64 credentials configured
- [ ] Health check passes
- [ ] Twilio webhook updated
- [ ] Dialogflow webhook updated
- [ ] Test WhatsApp conversation works
- [ ] Test franchise routing works
- [ ] Google Sheets lead capture works (if configured)
- [ ] Logs show no errors
- [ ] Set up monitoring (UptimeRobot)

---

## 📞 Support

**Render Documentation:**
- https://render.com/docs

**Render Status:**
- https://status.render.com/

**Community:**
- https://community.render.com/

---

## 🎉 Success!

Your WhatsApp bot is now live on Render.com! 🚀

**Your URLs:**
- App: `https://mckingstown-whatsapp-bot.onrender.com`
- WhatsApp Webhook: `https://mckingstown-whatsapp-bot.onrender.com/webhook/whatsapp`
- Dialogflow Webhook: `https://mckingstown-whatsapp-bot.onrender.com/webhook/dialogflow`

**Next Steps:**
1. Monitor logs for first few hours
2. Test with real customers
3. Set up UptimeRobot if using free tier
4. Consider upgrading to Starter for production

---

## 🔄 Alternative: Deploy with Blueprint

Use the included `render.yaml` file:

1. In Render Dashboard, click **New +** → **Blueprint**
2. Connect your GitHub repo
3. Render will read `render.yaml` and configure automatically
4. Still need to add environment variables manually

---

**Happy Deploying! 🎊**
