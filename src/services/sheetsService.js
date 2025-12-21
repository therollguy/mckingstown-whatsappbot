/**
 * Google Sheets Service
 * Handles lead capture and data storage to Google Sheets
 */

const { google } = require('googleapis');
const fs = require('fs');

class SheetsService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || null;
    
    // Initialize Google Sheets API if credentials are available
    this.initialize();
  }

  /**
   * Initialize Google Sheets API client
   */
  async initialize() {
    try {
      // Check if service account key exists
      const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (!credPath || !fs.existsSync(credPath)) {
        console.warn('⚠️  Google Sheets: Service account key not found. Lead saving disabled.');
        return;
      }

      // Authenticate with service account
      const auth = new google.auth.GoogleAuth({
        keyFile: credPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets service initialized');

    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error.message);
      this.sheets = null;
    }
  }

  /**
   * Save franchise lead to Google Sheets
   * @param {object} leadData - Lead information
   * @returns {object} Result of the operation
   */
  async saveFranchiseLead(leadData) {
    try {
      // If Sheets API not initialized, save to local file instead
      if (!this.sheets || !this.spreadsheetId) {
        return this.saveLeadToLocalFile(leadData, 'franchise');
      }

      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        leadData.name || 'Unknown',
        leadData.phone || '',
        leadData.city || '',
        leadData.state || '',
        leadData.location || '',
        leadData.officerAssigned || '',
        'Franchise',
        leadData.source || 'WhatsApp',
        'New'
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Franchise Leads!A:J',
        valueInputOption: 'RAW',
        resource: {
          values: [row],
        },
      });

      console.log('✅ Franchise lead saved to Google Sheets:', {
        phone: leadData.phone,
        location: leadData.location
      });

      return {
        success: true,
        method: 'google_sheets',
        rowsAdded: response.data.updates.updatedRows
      };

    } catch (error) {
      console.error('❌ Failed to save lead to Google Sheets:', error.message);
      
      // Fallback to local file
      return this.saveLeadToLocalFile(leadData, 'franchise');
    }
  }

  /**
   * Save customer inquiry to Google Sheets
   * @param {object} inquiryData - Inquiry information
   * @returns {object} Result of the operation
   */
  async saveCustomerInquiry(inquiryData) {
    try {
      // If Sheets API not initialized, save to local file instead
      if (!this.sheets || !this.spreadsheetId) {
        return this.saveLeadToLocalFile(inquiryData, 'customer');
      }

      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        inquiryData.name || 'Unknown',
        inquiryData.phone || '',
        inquiryData.intentName || '',
        inquiryData.queryText || '',
        inquiryData.response || '',
        'WhatsApp',
        inquiryData.confidence || 0
      ];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Customer Inquiries!A:H',
        valueInputOption: 'RAW',
        resource: {
          values: [row],
        },
      });

      console.log('✅ Customer inquiry saved to Google Sheets');

      return {
        success: true,
        method: 'google_sheets',
        rowsAdded: response.data.updates.updatedRows
      };

    } catch (error) {
      console.error('❌ Failed to save inquiry to Google Sheets:', error.message);
      
      // Fallback to local file
      return this.saveLeadToLocalFile(inquiryData, 'customer');
    }
  }

  /**
   * Fallback: Save lead to local JSON file
   * @param {object} data - Lead or inquiry data
   * @param {string} type - 'franchise' or 'customer'
   * @returns {object} Result of the operation
   */
  saveLeadToLocalFile(data, type) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Create data directory if it doesn't exist
      const dataDir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const filename = type === 'franchise' 
        ? 'franchise_leads.json' 
        : 'customer_inquiries.json';
      
      const filepath = path.join(dataDir, filename);

      // Read existing data
      let existingData = [];
      if (fs.existsSync(filepath)) {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        existingData = JSON.parse(fileContent);
      }

      // Add new entry with timestamp
      existingData.push({
        timestamp: new Date().toISOString(),
        ...data
      });

      // Write back to file
      fs.writeFileSync(filepath, JSON.stringify(existingData, null, 2));

      console.log(`✅ Lead saved to local file: ${filename}`);

      return {
        success: true,
        method: 'local_file',
        filepath: filepath
      };

    } catch (error) {
      console.error('❌ Failed to save lead to local file:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create spreadsheet with proper headers (one-time setup)
   * @param {string} spreadsheetId - Google Spreadsheet ID
   * @returns {object} Result of the operation
   */
  async setupSpreadsheet(spreadsheetId) {
    try {
      if (!this.sheets) {
        throw new Error('Google Sheets API not initialized');
      }

      // Create Franchise Leads sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Franchise Leads!A1:J1',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            'Timestamp',
            'Name',
            'Phone',
            'City',
            'State',
            'Location',
            'Officer Assigned',
            'Type',
            'Source',
            'Status'
          ]],
        },
      });

      // Create Customer Inquiries sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: 'Customer Inquiries!A1:H1',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            'Timestamp',
            'Name',
            'Phone',
            'Intent',
            'Query',
            'Response',
            'Source',
            'Confidence'
          ]],
        },
      });

      console.log('✅ Spreadsheet setup completed');

      return {
        success: true,
        message: 'Spreadsheet headers created successfully'
      };

    } catch (error) {
      console.error('❌ Failed to setup spreadsheet:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
module.exports = new SheetsService();
