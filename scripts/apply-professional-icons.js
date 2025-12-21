const fs = require('fs');

// Read webhook file
let webhookContent = fs.readFileSync('e:/mckingstown-whatsappbot/src/routes/whatsappWebhook.js', 'utf8');

// Replace emojis with professional symbols
webhookContent = webhookContent
  // Remove all casual emojis
  .replace(/😊/g, '')
  .replace(/😅/g, '')
  .replace(/💈/g, '')
  .replace(/🌟/g, '▸')
  .replace(/📍/g, '▸')
  .replace(/📞/g, 'Tel:')
  .replace(/🤝/g, '▸')
  .replace(/📋/g, '▸')
  .replace(/⏰/g, '▸')
  .replace(/🗓️/g, '▸')
  .replace(/📅/g, '▸')
  .replace(/1️⃣/g, '1.')
  .replace(/2️⃣/g, '2.')
  // Replace exclamation marks with periods
  .replace(/\s+!\s+/g, '. ');

// Write back
fs.writeFileSync('e:/mckingstown-whatsappbot/src/routes/whatsappWebhook.js', webhookContent);

// Read franchise service
let franchiseContent = fs.readFileSync('e:/mckingstown-whatsappbot/src/services/franchiseService.js', 'utf8');

// Replace emojis
franchiseContent = franchiseContent
  .replace(/🤝/g, '═══')
  .replace(/💰/g, '▸')
  .replace(/📊/g, '▸')
  .replace(/📍/g, '▸')
  .replace(/🏪/g, '▸')
  .replace(/📞/g, 'Tel:')
  .replace(/🌐/g, 'Web:')
  .replace(/📋/g, '▸')
  .replace(/⚠️/g, 'NOTE:')
  .replace(/📱/g, 'Mobile:')
  .replace(/✉️/g, 'Email:')
  .replace(/📅/g, '▸')
  .replace(/💵/g, '▸')
  .replace(/📈/g, '▸')
  .replace(/🎯/g, '▸')
  .replace(/✅/g, '▸')
  .replace(/✨/g, '▸')
  .replace(/💼/g, '▸')
  .replace(/🌟/g, '▸')
  .replace(/👤/g, '▸')
  .replace(/✓/g, '▸')
  // Replace bullets
  .replace(/•\s+/g, '  ➤ ')
  // Remove casual punctuation
  .replace(/\s+!\s+/g, '. ')
  .replace(/!\n/g, '.\n');

fs.writeFileSync('e:/mckingstown-whatsappbot/src/services/franchiseService.js', franchiseContent);

console.log('✓ Professional icons applied successfully');
