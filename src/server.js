const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const whatsappWebhook = require('./routes/whatsappWebhook');
const dialogflowWebhook = require('./routes/dialogflowWebhook');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'McKingstown WhatsApp Bot',
    timestamp: new Date().toISOString()
  });
});

// WhatsApp webhook route
app.use('/webhook', whatsappWebhook);

// Dialogflow webhook route (for fulfillment)
app.use('/webhook', dialogflowWebhook);

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
  console.log(`📱 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`🤖 Dialogflow Project: ${process.env.DIALOGFLOW_PROJECT_ID}`);
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
