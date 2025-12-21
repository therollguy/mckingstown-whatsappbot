# 🚢 Deployment Guide

## Overview

This guide covers deploying your McKingstown WhatsApp bot to production.

---

## 🎯 Deployment Checklist

Before deploying, ensure you have:

- ✅ Twilio WhatsApp Business API approved (not sandbox)
- ✅ Dialogflow agent fully configured with all intents
- ✅ Google Sheets set up for lead capture (or local storage ready)
- ✅ Service account JSON key file secured
- ✅ All environment variables documented
- ✅ Domain/hosting ready
- ✅ SSL certificate (HTTPS required for webhooks)

---

## 🌐 Deployment Options

### Option 1: Heroku (Easiest)

**Pros:** Easy setup, free tier available, automatic SSL
**Cons:** Free tier sleeps after 30 mins of inactivity

#### Step 1: Install Heroku CLI

```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
heroku --version
```

#### Step 2: Login and Create App

```bash
heroku login
heroku create mckingstown-whatsapp-bot
```

#### Step 3: Set Environment Variables

```bash
heroku config:set TWILIO_ACCOUNT_SID=your_account_sid
heroku config:set TWILIO_AUTH_TOKEN=your_auth_token
heroku config:set TWILIO_WHATSAPP_FROM=whatsapp:+your_number
heroku config:set DIALOGFLOW_PROJECT_ID=your_project_id
heroku config:set GOOGLE_SHEET_ID=your_sheet_id
heroku config:set NODE_ENV=production
```

#### Step 4: Upload Service Account Key

**Option A: Base64 encode (recommended)**

```bash
# On Linux/Mac
cat config/dialogflow-service-account.json | base64

# On Windows PowerShell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("config/dialogflow-service-account.json"))
```

Set as environment variable:
```bash
heroku config:set GOOGLE_CREDENTIALS_BASE64=your_base64_string
```

Update code to decode:
```javascript
// In src/services/dialogflowService.js
const credentials = process.env.GOOGLE_CREDENTIALS_BASE64 
  ? JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString())
  : require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
```

**Option B: Use Heroku's filesystem (not recommended)**

Upload via buildpack or manual deployment.

#### Step 5: Create Procfile

```bash
echo "web: node src/server.js" > Procfile
```

#### Step 6: Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Step 7: Verify Deployment

```bash
heroku open
heroku logs --tail
```

Your app will be available at: `https://mckingstown-whatsapp-bot.herokuapp.com`

#### Step 8: Update Twilio Webhook

Update webhook URL to:
```
https://mckingstown-whatsapp-bot.herokuapp.com/webhook/whatsapp
```

---

### Option 2: AWS EC2

**Pros:** Full control, scalable, reliable
**Cons:** More setup required, costs apply

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Launch instance:
   - AMI: Ubuntu 22.04 LTS
   - Type: t2.micro (free tier)
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

#### Step 2: Connect and Install Dependencies

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### Step 3: Clone Your Code

```bash
git clone https://github.com/yourusername/mckingstown-whatsappbot.git
cd mckingstown-whatsappbot
npm install --production
```

#### Step 4: Configure Environment

```bash
nano .env
# Add all your environment variables
```

Upload service account key:
```bash
# From your local machine
scp -i your-key.pem config/dialogflow-service-account.json ubuntu@your-ec2-ip:~/mckingstown-whatsappbot/config/
```

#### Step 5: Start with PM2

```bash
pm2 start src/server.js --name whatsapp-bot
pm2 save
pm2 startup
```

#### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/whatsapp-bot

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/whatsapp-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Set Up SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Step 8: Update Twilio Webhook

Update webhook URL to:
```
https://your-domain.com/webhook/whatsapp
```

---

### Option 3: Azure App Service

**Pros:** Microsoft ecosystem, easy scaling
**Cons:** Costs can add up

#### Step 1: Create App Service

```bash
# Install Azure CLI
az login
az webapp up --name mckingstown-whatsapp-bot --resource-group MyResourceGroup --runtime "NODE:20-lts"
```

#### Step 2: Configure App Settings

```bash
az webapp config appsettings set --name mckingstown-whatsapp-bot --resource-group MyResourceGroup --settings \
  TWILIO_ACCOUNT_SID=your_sid \
  TWILIO_AUTH_TOKEN=your_token \
  TWILIO_WHATSAPP_FROM=whatsapp:+your_number \
  DIALOGFLOW_PROJECT_ID=your_project \
  GOOGLE_SHEET_ID=your_sheet
```

#### Step 3: Deploy Code

```bash
az webapp deployment source config-local-git --name mckingstown-whatsapp-bot --resource-group MyResourceGroup
git remote add azure <deployment_url>
git push azure main
```

---

### Option 4: Google Cloud Run (Serverless)

**Pros:** Serverless, auto-scaling, pay-per-use
**Cons:** Cold starts, more complex setup

#### Step 1: Create Dockerfile

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD ["node", "src/server.js"]
```

#### Step 2: Build and Deploy

```bash
gcloud auth login
gcloud config set project whatsapp-bot-mckingstown-tyiw

# Build container
gcloud builds submit --tag gcr.io/whatsapp-bot-mckingstown-tyiw/whatsapp-bot

# Deploy to Cloud Run
gcloud run deploy whatsapp-bot \
  --image gcr.io/whatsapp-bot-mckingstown-tyiw/whatsapp-bot \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars TWILIO_ACCOUNT_SID=your_sid,TWILIO_AUTH_TOKEN=your_token
```

---

## 🔧 Production Best Practices

### 1. Environment Variables

Never commit sensitive data to Git. Use:
- Heroku Config Vars
- AWS Systems Manager Parameter Store
- Azure Key Vault
- Google Secret Manager

### 2. Logging

Use a logging service:
- Papertrail
- Loggly
- AWS CloudWatch
- Google Cloud Logging

### 3. Monitoring

Set up uptime monitoring:
- UptimeRobot (free)
- Pingdom
- New Relic
- Datadog

### 4. Error Tracking

Integrate error tracking:
- Sentry
- Rollbar
- Bugsnag

### 5. Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests, please try again later.'
});

app.use('/webhook', limiter);
```

### 6. Health Checks

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

Configure monitoring to ping this endpoint every 5 minutes.

---

## 📊 Performance Optimization

### 1. Enable Caching

Cache franchise officer data in memory:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour
```

### 2. Connection Pooling

Reuse Twilio and Dialogflow clients (already done).

### 3. Async Operations

Make Google Sheets writes async (already done).

### 4. Compress Responses

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🔒 Security Hardening

### 1. Validate Twilio Requests

Add signature validation:

```javascript
const twilio = require('twilio');

app.use('/webhook/whatsapp', (req, res, next) => {
  const signature = req.headers['x-twilio-signature'];
  const url = `https://yourdomain.com${req.originalUrl}`;
  
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body
  );
  
  if (!isValid) {
    return res.status(403).send('Forbidden');
  }
  
  next();
});
```

### 2. Use HTTPS Only

Force HTTPS in production:

```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### 3. Set Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 💰 Cost Estimation

### Monthly Costs (for 10,000 conversations)

| Service | Cost |
|---------|------|
| Twilio WhatsApp | ₹3,000 - ₹5,000 |
| Heroku Hobby Dyno | $7 (₹580) |
| Domain Name | ₹500 - ₹1,000/year |
| SSL Certificate | Free (Let's Encrypt) |
| Google Sheets | Free |
| Dialogflow | Free (< 15,000 requests/month) |
| **Total** | **₹3,580 - ₹5,580/month** |

---

## 📞 Post-Deployment

### 1. Update Twilio Webhook

Production webhook URL:
```
https://your-domain.com/webhook/whatsapp
```

### 2. Update Dialogflow Webhook

Production webhook URL:
```
https://your-domain.com/webhook/dialogflow
```

### 3. Test End-to-End

1. Send "Hello" from WhatsApp
2. Ask "What is haircut price?"
3. Say "I want franchise"
4. Provide location
5. Verify lead is saved to Google Sheets

### 4. Monitor Logs

```bash
# Heroku
heroku logs --tail

# PM2
pm2 logs whatsapp-bot

# Docker
docker logs -f container_name
```

---

## 🐛 Troubleshooting

### High response times
- Check Dialogflow latency
- Optimize database queries
- Add caching

### Memory leaks
- Monitor with `pm2 monit`
- Add memory limits
- Restart daily: `pm2 restart whatsapp-bot --cron "0 4 * * *"`

### Webhook timeouts
- Twilio timeout: 10 seconds
- Optimize code paths
- Return 200 OK immediately, process async

---

## 📚 Resources

- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2/)
- [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)

---

**Deployment Complete! 🎉**

Your WhatsApp bot is now live and ready to handle customer inquiries and franchise leads!
