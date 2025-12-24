const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables BEFORE importing routes/services
dotenv.config();

const whatsappWebhook = require('./routes/whatsappWebhook');
const dialogflowWebhook = require('./routes/dialogflowWebhook');
const testingWebhook = require('./routes/testingWebhook');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (for test interface)
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'McKingstown WhatsApp Bot',
    timestamp: new Date().toISOString(),
    testInterface: `http://localhost:${PORT}/test-chat.html`,
    note: 'Use /test-chat.html for FREE local testing (no Twilio costs)'
  });
});

// WhatsApp webhook route (PRODUCTION - costs money)
app.use('/webhook', whatsappWebhook);

// Testing webhook route (LOCAL - FREE)
app.use('/webhook', testingWebhook);

// Dialogflow webhook route (for fulfillment)
app.use('/webhook', dialogflowWebhook);

// Dashboard routes (Lead tracking & management)
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📱 PRODUCTION (Costs ₹):`);
  console.log(`   WhatsApp: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`\n🧪 LOCAL TESTING (FREE):`);
  console.log(`   Interface: http://localhost:${PORT}/test-chat.html`);
  console.log(`   API: http://localhost:${PORT}/webhook/test`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`💡 TIP: Use test-chat.html for development to avoid Twilio costs!`);
  console.log(`🤖 Dialogflow Project: ${process.env.DIALOGFLOW_PROJECT_ID || 'Mock Mode (FREE)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});
