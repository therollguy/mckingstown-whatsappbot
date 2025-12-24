# 🚀 Franchise Lead Forwarding System - Complete Setup Guide

## ✅ System Overview

Your McKingstown WhatsApp bot now has a **complete franchise enquiry management system** with:

1. **Automatic Lead Capture** - Every franchise enquiry is logged
2. **Smart Regional Forwarding** - Enquiries forwarded to appropriate regional advisors
3. **Lead Dashboard** - Web-based dashboard to track and manage all leads
4. **Master Dashboard Integration** - All leads stored in JSON file for easy export/integration

---

## 🎯 Features Implemented

### 1. Automatic Lead Capture
- ✅ Every franchise enquiry automatically creates a lead
- ✅ Captures: Phone, Name, Location, Enquiry Type, Message
- ✅ Assigns unique Lead ID for tracking
- ✅ Timestamps all activities

### 2. Smart Regional Forwarding
- ✅ Detects location from customer message
- ✅ Forwards to appropriate regional franchise advisor via WhatsApp
- ✅ Sends formatted lead details to advisor
- ✅ Sends confirmation to customer

### 3. Lead Dashboard
- ✅ Real-time web dashboard at `/dashboard`
- ✅ View all leads with filters (status, phone, date)
- ✅ Export leads to CSV
- ✅ Track lead status (new, forwarded, contacted, converted)
- ✅ Add notes to leads
- ✅ Statistics and analytics

### 4. Regional Advisor Management
- ✅ Configurable regional advisors for different areas
- ✅ Coverage areas: South India, West India, North India, East India, Dubai
- ✅ Easy to add/update advisor contacts

---

## 📋 Configuration Steps

### Step 1: Configure Regional Advisors

**File:** `src/data/regionalAdvisors.js`

When you have the regional advisor contact details, update this file:

```javascript
// Example configuration
const regionalAdvisors = {
  southIndia: {
    name: "Rajesh Kumar - South India Franchise Advisor",
    whatsappNumber: "+919876543210", // ⚠️ UPDATE THIS
    coverageAreas: [
      "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
      "Chennai", "Bangalore", "Hyderabad", "Coimbatore", "Madurai", ...
    ],
    active: true // ⚠️ Set to true when configured
  },
  
  westIndia: {
    name: "Priya Sharma - West India Franchise Advisor",
    whatsappNumber: "+919123456789", // ⚠️ UPDATE THIS
    coverageAreas: [
      "Gujarat", "Maharashtra", "Goa", "Rajasthan",
      "Mumbai", "Ahmedabad", "Surat", "Pune", ...
    ],
    active: true // ⚠️ Set to true when configured
  },
  
  // ... configure other regions similarly
};
```

**Important:**
- WhatsApp numbers must be in international format: `+91XXXXXXXXXX`
- Set `active: true` only after verifying the number works
- Coverage areas help auto-route leads to correct advisor

### Step 2: Update Contact Details (Optional)

**File:** `src/services/franchiseForwardingService.js`

Update the customer confirmation message with your actual contact details:

```javascript
// Line ~220
📞 Call: 1800-XXX-XXXX (Toll Free)  // ⚠️ UPDATE THIS
📧 Email: franchise@mckingstown.com  // ⚠️ UPDATE THIS
```

### Step 3: Test the System

#### Test Without Regional Advisors (Current State):
```bash
# Start the server
npm start

# Send a test franchise enquiry
POST http://localhost:3000/webhook/test
Body: { "message": "I want to know about franchise in Chennai" }
```

**Expected Behavior:**
- ✅ Lead is created and logged
- ✅ Lead appears in dashboard
- ⚠️ NOT forwarded (no advisors configured yet)
- ✅ Customer gets immediate response with franchise info

#### Test With Regional Advisors (After Configuration):
```bash
# Same test as above
```

**Expected Behavior:**
- ✅ Lead is created and logged
- ✅ Lead automatically forwarded to South India advisor (Chennai detected)
- ✅ Advisor receives WhatsApp message with lead details
- ✅ Customer gets confirmation message
- ✅ Lead status updated to "forwarded"

---

## 📊 Dashboard Access

### Access Dashboard:
```
http://localhost:3000/dashboard
```

### Dashboard Features:

1. **Statistics Cards**
   - Total leads (all time)
   - Today's leads
   - This week's leads
   - Active regional advisors

2. **Lead Table**
   - View all leads with details
   - Filter by status, phone, date
   - Real-time updates (auto-refresh every 30s)
   - Export to CSV

3. **API Endpoints**
   ```
   GET  /dashboard                      - Dashboard HTML page
   GET  /dashboard/stats                - Statistics summary
   GET  /dashboard/leads                - All leads (with filters)
   GET  /dashboard/leads/:leadId        - Specific lead details
   PUT  /dashboard/leads/:leadId/status - Update lead status
   POST /dashboard/leads/:leadId/notes  - Add note to lead
   GET  /dashboard/leads/export/csv     - Export leads to CSV
   GET  /dashboard/advisors             - Regional advisors config
   ```

---

## 🔄 How It Works

### Customer Journey:
```
1. Customer asks about franchise
   ↓
2. Bot detects "franchise" intent
   ↓
3. System creates lead in database
   ↓
4. System detects location from message
   ↓
5. System finds appropriate regional advisor
   ↓
6. Lead forwarded to advisor via WhatsApp
   ↓
7. Confirmation sent to customer
   ↓
8. Bot provides immediate franchise info
```

### Lead Information Captured:
- **Lead ID**: Unique identifier (e.g., `LEAD-1703427123456-abc123def`)
- **Customer Phone**: WhatsApp number
- **Customer Name**: From WhatsApp profile
- **Location**: Detected from message or "Not specified"
- **Enquiry Type**: investment, revenue, support, location, general
- **Enquiry Message**: Full customer message
- **Status**: new, forwarded, contacted, in_discussion, converted, not_interested
- **Regional Advisor**: Assigned advisor details
- **Timestamps**: Created, Updated, Forwarded
- **Notes**: Activity log and notes

### Message Sent to Regional Advisor:
```
🚨 *NEW FRANCHISE ENQUIRY*

▸ *Lead ID:* LEAD-1703427123456-abc123def
▸ *Date/Time:* 24 Dec 2025, 10:30 AM
▸ *Customer Phone:* +919876543210
▸ *Customer Name:* Ravi Kumar
▸ *Location Interest:* Chennai
▸ *Enquiry Type:* investment

📝 *Customer Message:*
"I want to know about franchise investment in Chennai area"

💡 *Interested In:*
  • Franchise Opportunity

────────────────────────
⚡ *ACTION REQUIRED*
Please contact the customer within 24 hours.

📊 This lead has been logged in the master dashboard.
```

---

## 📂 File Structure

```
src/
├── data/
│   └── regionalAdvisors.js         ⚠️ Configure advisor contacts here
│
├── services/
│   ├── franchiseForwardingService.js   - Forwarding logic
│   └── leadDashboardService.js         - Dashboard data management
│
├── routes/
│   ├── dashboardRoutes.js              - Dashboard API endpoints
│   ├── whatsappWebhook.js              - Production webhook (integrated)
│   └── testingWebhook.js               - Testing webhook (integrated)
│
└── server.js                           - Main server (dashboard route added)

data/
└── franchise-leads.json                - Lead database (auto-created)
```

---

## 🧪 Testing Checklist

### Before Regional Advisors Configured:
- [ ] Test franchise query → Lead created in database
- [ ] Check dashboard → Lead appears in table
- [ ] Verify lead details → All info captured correctly
- [ ] Test CSV export → Lead exports properly
- [ ] Customer gets immediate franchise info response

### After Regional Advisors Configured:
- [ ] Test with Chennai location → Forwarded to South India advisor
- [ ] Test with Mumbai location → Forwarded to West India advisor
- [ ] Test with Dubai location → Forwarded to Dubai advisor
- [ ] Verify advisor receives WhatsApp message
- [ ] Verify customer receives confirmation
- [ ] Check dashboard → Lead status shows "forwarded"
- [ ] Verify lead has advisor details assigned

---

## 🔧 Troubleshooting

### Issue: Leads not being forwarded
**Solution:**
1. Check `regionalAdvisors.js` → `active: true`?
2. Verify WhatsApp number format: `+91XXXXXXXXXX`
3. Check console logs for error messages
4. Verify Twilio credentials in `.env`

### Issue: Dashboard not loading
**Solution:**
1. Check if server is running: `npm start`
2. Access: `http://localhost:3000/dashboard`
3. Check console for errors
4. Verify `dashboardRoutes.js` is imported in `server.js`

### Issue: Lead not capturing location
**Solution:**
1. Customer must mention city/state in message
2. Add more cities to coverage areas if needed
3. Manual location assignment possible via dashboard

### Issue: Advisor not receiving WhatsApp message
**Solution:**
1. Verify Twilio WhatsApp sandbox is approved for advisor's number
2. Check advisor's WhatsApp number format
3. Verify Twilio account has credits
4. Check Twilio console for message delivery status

---

## 📈 Lead Status Workflow

```
NEW
 ↓ (auto-forwarded to advisor)
FORWARDED
 ↓ (advisor contacts customer)
CONTACTED
 ↓ (discussions ongoing)
IN_DISCUSSION
 ↓
CONVERTED (successful) or NOT_INTERESTED (unsuccessful)
```

Update status via dashboard API:
```bash
PUT /dashboard/leads/:leadId/status
Body: { "status": "contacted", "note": "Called customer, interested in Chennai location" }
```

---

## 🎨 Dashboard Preview

The dashboard shows:
- **Real-time statistics** (total, today, week, month)
- **Lead table** with all details
- **Status badges** (color-coded)
- **Export button** (CSV download)
- **Auto-refresh** (every 30 seconds)
- **Responsive design** (works on mobile)

---

## 🚀 Next Steps

### When You Have Advisor Contacts:

1. **Update Regional Advisors**
   ```bash
   # Edit: src/data/regionalAdvisors.js
   # Set whatsappNumber and active: true for each region
   ```

2. **Test Forwarding**
   ```bash
   # Send test franchise query with location
   # Verify advisor receives message
   # Verify customer receives confirmation
   ```

3. **Monitor Dashboard**
   ```bash
   # Open: http://localhost:3000/dashboard
   # Watch leads appear in real-time
   # Export CSV for analysis
   ```

4. **Integrate with Master Dashboard** (Optional)
   - Leads stored in: `data/franchise-leads.json`
   - Export CSV from dashboard
   - Or build API integration using dashboard API endpoints

---

## 💡 Tips

1. **Test thoroughly** before configuring real advisor numbers
2. **Start with one region** (e.g., South India) before enabling all
3. **Monitor dashboard** regularly for lead quality and volume
4. **Use CSV export** for weekly/monthly reports
5. **Add notes to leads** to track follow-up activities
6. **Update lead status** to maintain accurate pipeline

---

## 📞 Support

If you encounter issues:
1. Check console logs for error messages
2. Verify all configuration in `regionalAdvisors.js`
3. Test with local webhook first (`/webhook/test`)
4. Check Twilio console for message delivery status

---

## ✅ Current Status

- ✅ Lead capture system: **ACTIVE**
- ✅ Dashboard: **ACTIVE** (accessible at `/dashboard`)
- ✅ Database: **ACTIVE** (`data/franchise-leads.json`)
- ⏳ Regional forwarding: **WAITING FOR ADVISOR CONTACTS**
- ⏳ Customer confirmations: **WAITING FOR CONTACT DETAILS**

**Ready to go live as soon as you configure regional advisor WhatsApp numbers!** 🚀
