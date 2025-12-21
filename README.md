# McKingstown WhatsApp Bot

Smart WhatsApp chatbot for McKingstown barbershop with 100+ outlets. Handles customer service queries and franchise inquiries using Twilio + Dialogflow integration.

## 🎯 Features

- **Natural Conversations**: AI-powered responses using Dialogflow
- **Customer Service**: Answers questions about haircut prices, services, timing, and appointments
- **Franchise Routing**: Routes franchise inquiries to the correct state/city manager
- **Lead Capture**: Saves franchise leads to Excel/Google Sheets
- **Real-time Responses**: Fast webhook-based architecture
- **Scalable**: Built with Node.js and Express

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **WhatsApp API**: Twilio
- **AI/NLU**: Dialogflow (Google Cloud)
- **Environment**: dotenv for configuration

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Twilio Account** with WhatsApp enabled
3. **Google Cloud Account** with Dialogflow API enabled
4. **Dialogflow Service Account Key** (JSON file)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Dialogflow Configuration
DIALOGFLOW_PROJECT_ID=your_project_id_here
GOOGLE_APPLICATION_CREDENTIALS=./config/dialogflow-service-account.json

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Add Dialogflow Service Account Key

1. Download your Dialogflow service account JSON key from Google Cloud Console
2. Save it as `config/dialogflow-service-account.json`

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### 5. Configure Twilio Webhook

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Settings** → **WhatsApp Sandbox**
3. Set the webhook URL to: `https://your-domain.com/webhook/whatsapp`
4. Method: `POST`

**For local testing, use ngrok:**
```bash
ngrok http 3000
```
Then use the ngrok URL: `https://abc123.ngrok.io/webhook/whatsapp`

## 📁 Project Structure

```
mckingstown-whatsappbot/
├── src/
│   ├── server.js                  # Main Express server
│   ├── routes/
│   │   └── whatsappWebhook.js     # WhatsApp webhook endpoint
│   └── services/
│       ├── dialogflowService.js   # Dialogflow integration
│       └── twilioService.js       # Twilio WhatsApp API
├── config/
│   └── dialogflow-service-account.json  # Google Cloud credentials
├── .env                           # Environment variables (not in git)
├── .env.example                   # Template for environment variables
├── package.json                   # Node.js dependencies
└── README.md                      # This file
```

## 🔄 How It Works

1. **Customer sends WhatsApp message** → Twilio receives it
2. **Twilio forwards to webhook** → `POST /webhook/whatsapp`
3. **Backend sends to Dialogflow** → Intent detection + NLU processing
4. **Dialogflow returns response** → Intent + fulfillment text
5. **Backend sends reply via Twilio** → WhatsApp message to customer
6. **Webhook responds with 200 OK** → Confirms to Twilio

## 📝 API Endpoints

### `POST /webhook/whatsapp`
Receives incoming WhatsApp messages from Twilio.

**Request (from Twilio):**
```
From: whatsapp:+919876543210
Body: What is the haircut price?
ProfileName: John Doe
```

**Response:** HTTP 200 OK

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "service": "McKingstown WhatsApp Bot",
  "timestamp": "2025-12-21T10:30:00.000Z"
}
```

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `AC31f412e39751...` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `cb50706d9988f6663...` |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp number | `whatsapp:+14155238886` |
| `DIALOGFLOW_PROJECT_ID` | Google Cloud Dialogflow project ID | `whatsapp-bot-mckingstown-tyiw` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON | `./config/dialogflow-service-account.json` |
| `PORT` | Server port (optional) | `3000` |
| `NODE_ENV` | Environment (optional) | `development` or `production` |

## 🧪 Testing

### Test with cURL

**Send a test message:**
```bash
curl -X POST http://localhost:3000/webhook/whatsapp \
  -d "From=whatsapp:+919876543210" \
  -d "Body=What is the haircut price?" \
  -d "ProfileName=Test User"
```

### Test with Postman

1. Create a POST request to `http://localhost:3000/webhook/whatsapp`
2. Set `Content-Type` to `application/x-www-form-urlencoded`
3. Add body parameters:
   - `From`: `whatsapp:+919876543210`
   - `Body`: `What is the haircut price?`
   - `ProfileName`: `Test User`

## 🚢 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create mckingstown-whatsapp-bot

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
heroku config:set DIALOGFLOW_PROJECT_ID=your_project_id
heroku config:set GOOGLE_APPLICATION_CREDENTIALS=./config/dialogflow-service-account.json

# Deploy
git push heroku main

# Update Twilio webhook to: https://mckingstown-whatsapp-bot.herokuapp.com/webhook/whatsapp
```

### Deploy to AWS / Azure / GCP

See deployment guides in `/docs` folder (coming soon).

## 📊 Logs

The server logs all important events:

- ✅ Success events
- ❌ Error events
- 📩 Incoming messages
- 🤖 Dialogflow requests
- 📤 Outgoing responses

## 🔒 Security

- ✅ All secrets stored in environment variables
- ✅ Service account key file excluded from git
- ✅ Express body size limits
- ✅ Error handling without exposing sensitive data

## 🐛 Troubleshooting

### Error: "DIALOGFLOW_PROJECT_ID is not set"
- Make sure `.env` file exists and contains `DIALOGFLOW_PROJECT_ID`

### Error: "Twilio credentials are not properly configured"
- Verify all three Twilio variables are set in `.env`

### Error: "Failed to send WhatsApp message"
- Check Twilio account balance
- Verify WhatsApp Sandbox is active
- Ensure recipient has joined sandbox (for testing)

### Error: "Dialogflow API error"
- Verify service account JSON file exists at the specified path
- Check Google Cloud project has Dialogflow API enabled
- Ensure service account has correct permissions

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

ISC

---

**Built for McKingstown Barbershop** | Powered by Twilio + Dialogflow
