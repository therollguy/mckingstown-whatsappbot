# 📊 Google Sheets Integration Guide

## Overview

This guide explains how to set up Google Sheets for lead capture and customer inquiry tracking.

## Why Google Sheets?

- ✅ **Easy to use**: No database setup required
- ✅ **Collaborative**: Multiple team members can access
- ✅ **Free**: No additional costs
- ✅ **Familiar**: Everyone knows how to use spreadsheets
- ✅ **Export ready**: Easy to export to Excel, CSV, CRM

## 🚀 Quick Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: "McKingstown WhatsApp Leads"
4. Create two sheets (tabs):
   - `Franchise Leads`
   - `Customer Inquiries`

### Step 2: Set Up Sheet Headers

**Sheet 1: Franchise Leads**

Add these headers in row 1:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | City | State | Location | Officer Assigned | Type | Source | Status |

**Sheet 2: Customer Inquiries**

Add these headers in row 1:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Intent | Query | Response | Source | Confidence |

### Step 3: Share with Service Account

1. In your Google Sheet, click **Share** button (top-right)
2. Add the service account email as an editor:
   - Email format: `something@project-id.iam.gserviceaccount.com`
   - You can find this in your `dialogflow-service-account.json` file
   - Look for the `client_email` field
3. Make sure permission is set to **Editor**
4. Click **Send** (uncheck "Notify people")

### Step 4: Get Spreadsheet ID

1. Look at your Google Sheets URL:
   ```
   https://docs.google.com/spreadsheets/d/1abc123XYZ456_SAMPLE_ID/edit
   ```
2. Copy the part between `/d/` and `/edit` - that's your **Spreadsheet ID**
3. Add it to your `.env` file:
   ```env
   GOOGLE_SHEET_ID=1abc123XYZ456_SAMPLE_ID
   ```

### Step 5: Test the Integration

Run this command to test:

```bash
node test-sheets.js
```

Or start the server and trigger a franchise inquiry through WhatsApp.

---

## 📝 Sample Data

### Franchise Lead Entry

```
Timestamp: 2025-12-21T10:30:00.000Z
Name: Unknown
Phone: +919876543210
City: Chennai
State: Tamil Nadu
Location: Chennai, Tamil Nadu
Officer Assigned: Rajesh Kumar
Type: Franchise
Source: WhatsApp Chatbot
Status: New
```

### Customer Inquiry Entry

```
Timestamp: 2025-12-21T10:35:00.000Z
Name: Unknown
Phone: +919876543210
Intent: customer.service.haircut.price
Query: What is haircut price?
Response: Our haircut prices are: Standard ₹250, Premium ₹400...
Source: WhatsApp
Confidence: 0.95
```

---

## 🛠️ Alternative: Local File Storage

If you don't want to use Google Sheets, the system automatically falls back to **local JSON files**.

**Advantages:**
- ✅ No Google Sheets setup required
- ✅ Works offline
- ✅ Faster (no API calls)

**Disadvantages:**
- ❌ Not collaborative
- ❌ Manual export needed
- ❌ Harder to visualize data

**Files are saved to:**
- `data/franchise_leads.json`
- `data/customer_inquiries.json`

**To convert JSON to Excel:**

```bash
# Install json2csv (optional)
npm install -g json2csv

# Convert to CSV
json2csv data/franchise_leads.json > leads.csv
```

---

## 🔧 Advanced Configuration

### Automatic Sheet Setup (Optional)

If you want the backend to automatically create headers:

```javascript
const sheetsService = require('./src/services/sheetsService');

// Run once to setup headers
sheetsService.setupSpreadsheet('YOUR_SPREADSHEET_ID').then(result => {
  console.log(result);
});
```

### Custom Sheet Names

Edit `src/services/sheetsService.js`:

```javascript
// Change sheet names here
range: 'Franchise Leads!A:J',  // Change 'Franchise Leads' to your name
range: 'Customer Inquiries!A:H',  // Change 'Customer Inquiries' to your name
```

### Add More Columns

To add custom columns:

1. Update the header row in Google Sheets
2. Update the `row` array in `saveFranchiseLead()` or `saveCustomerInquiry()`
3. Pass additional data from webhook handlers

Example:

```javascript
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
  'New',
  leadData.email || '',  // NEW COLUMN
  leadData.comments || ''  // NEW COLUMN
];
```

---

## 📊 Data Analysis Tips

### Filter by Status
1. In Google Sheets, select column J (Status)
2. Click **Data** → **Create a filter**
3. Filter by: New, Contacted, Converted, etc.

### Sort by Date
1. Select column A (Timestamp)
2. Click **Data** → **Sort sheet** → **Sort by column A (Z → A)**

### Count Leads by State
Use this formula in an empty cell:

```
=COUNTIF(E:E,"Tamil Nadu")
```

### Daily Lead Report
Use this formula:

```
=COUNTIFS(A:A,">="&TODAY(),A:A,"<"&TODAY()+1)
```

---

## 🔐 Security Best Practices

1. **Service Account Access**
   - Only share with the service account email
   - Don't make the sheet public

2. **Protect Headers**
   - Right-click row 1 → Protect range
   - This prevents accidental header deletion

3. **Regular Backups**
   - File → Download → Microsoft Excel (.xlsx)
   - Schedule weekly backups

4. **Access Control**
   - Limit who can edit the sheet
   - Use "View only" for most team members

---

## 🐛 Troubleshooting

### "Permission denied" error
- Make sure service account email has Editor access to the sheet
- Check if the email in `client_email` field matches the shared email

### "Spreadsheet not found" error
- Verify `GOOGLE_SHEET_ID` in `.env` is correct
- Make sure sheet exists and is accessible

### "Values not appending" error
- Check if sheet names match: `Franchise Leads` and `Customer Inquiries`
- Verify range is correct: `A:J` for franchise, `A:H` for inquiries

### Leads saving to local file instead
- This is the fallback behavior
- Check Google Sheets setup steps above
- Verify service account has access

---

## 📚 Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)
- [Sheets API Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)

---

**Next Steps:**
1. ✅ Complete setup and test lead capture
2. ✅ Monitor leads in Google Sheets
3. ✅ Set up alerts or integrations (optional)
