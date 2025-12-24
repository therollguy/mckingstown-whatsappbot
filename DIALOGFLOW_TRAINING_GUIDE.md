# 🎯 Dialogflow Training Guide for McKingstown Bot

## Why You Need This
Your bot is currently getting confused because Dialogflow doesn't know how to detect user intents accurately. This guide will help you train Dialogflow to understand customer queries perfectly.

---

## Quick Fix (5 Minutes)

### Step 1: Access Dialogflow Console
1. Go to: https://dialogflow.cloud.google.com/
2. Select project: `whatsapp-bot-mckingstown-tyiw`
3. Click on **Intents** in left menu

### Step 2: Train Essential Intents

#### Intent 1: Welcome Intent (Already Exists - Just Verify)
**Training Phrases:**
- Hello
- Hi
- Hey
- Good morning
- Start
- Begin

**Response:**
```
Welcome to McKingstown Men's Salon!

Type "menu" to see our services, or ask me anything about:
- Haircut prices
- Beard services
- Booking appointments
- Franchise opportunities
```

---

#### Intent 2: Services.Haircut (Create New)
**Training Phrases:**
- haircut
- hair cut
- I need a haircut
- What is the haircut price
- How much for a haircut
- haircut cost
- Show me haircut prices
- hair cutting
- hairstyle
- hair style options

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 3: Services.Beard (Create New)
**Training Phrases:**
- beard
- beard trim
- I want beard trimming
- beard price
- shaving
- shave my beard
- mustache trim
- beard styling
- zero trim
- how much for beard

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 4: Services.Facial (Create New)
**Training Phrases:**
- facial
- face treatment
- I want a facial
- facial price
- how much facial
- skin care
- face care
- cleanup
- clean up
- glow facial

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 5: Services.Spa (Create New)
**Training Phrases:**
- spa
- hair spa
- I want hair spa
- spa price
- hair treatment
- scalp treatment
- dandruff treatment
- hair fall treatment

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 6: Booking.Appointment (Create New)
**Training Phrases:**
- book
- booking
- I want to book
- book appointment
- make appointment
- schedule appointment
- reserve
- book a slot
- can I book

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 7: Location.Outlets (Create New)
**Training Phrases:**
- where
- location
- where is your outlet
- nearest outlet
- find location
- outlet near me
- address
- where are you located
- branch location
- find nearest salon

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 8: Business.Franchise (Create New)
**Training Phrases:**
- franchise
- franchisee
- I want franchise
- franchise opportunity
- business opportunity
- partnership
- invest in franchise
- how to start franchise
- franchise cost
- franchise investment

**Fulfillment:** Enable webhook
**Response:** (Leave empty, webhook will handle it)

---

#### Intent 9: Timing.Hours (Create New)
**Training Phrases:**
- timing
- time
- what time
- opening hours
- when are you open
- working hours
- when do you close
- business hours
- schedule
- hours

**Response:**
```
▸ McKingstown Opening Hours

▸ Monday - Saturday: 9:00 AM - 9:00 PM
▸ Sunday: 10:00 AM - 8:00 PM

We're here 7 days a week!
```

---

#### Intent 10: General.Price (Create New)
**Training Phrases:**
- price
- cost
- how much
- pricing
- charges
- rate
- what is the price
- tell me prices
- show prices
- price list

**Response:**
```
I can help you with pricing information.

Our services start from:
➤ Haircut - ₹75
➤ Beard Trim - ₹40
➤ Facials - ₹300
➤ Hair Spa - ₹400

Type "menu" for complete price list or ask about a specific service.
```

---

## Step 3: Enable Webhook for Fulfillment

1. Go to **Fulfillment** in left menu
2. Toggle **Webhook** to **ENABLED**
3. Enter URL: `https://your-render-app.onrender.com/webhook/dialogflow`
   - Replace `your-render-app` with your actual Render app name
4. Click **SAVE**

---

## Step 4: Test in Dialogflow Simulator

1. Click "Try it now" in the right panel
2. Test these phrases:
   - "haircut" → Should detect `Services.Haircut`
   - "I want to book" → Should detect `Booking.Appointment`
   - "where is your outlet" → Should detect `Location.Outlets`
   - "franchise" → Should detect `Business.Franchise`

If any phrase is not detected correctly:
- Add it as a training phrase to the correct intent
- Click **SAVE**
- Test again

---

## Common Issues & Fixes

### Issue 1: "Default Fallback Intent" Triggered Too Often
**Solution:** Add more training phrases to your custom intents

**Fix:**
1. Go to **Intents** → Click on the intent that should have matched
2. Add the user's query as a new training phrase
3. Save and test again

---

### Issue 2: Wrong Intent Detected
**Solution:** Retrain Dialogflow

**Fix:**
1. Go to **Training** in left menu
2. Review recent queries
3. If a query was matched to wrong intent:
   - Click on it
   - Select correct intent from dropdown
   - Click **APPROVE**
4. This teaches Dialogflow the correct mapping

---

### Issue 3: Low Confidence Scores
**Solution:** Add more training phrases

**Fix:** Each intent should have at least 10-15 training phrases for good accuracy

---

## Advanced: Entities (Optional)

### Create @city Entity
1. Go to **Entities** → Click **CREATE ENTITY**
2. Name: `city`
3. Add entries:
   ```
   chennai: chennai, madras, tambaram, velachery
   bangalore: bangalore, bengaluru, blr
   coimbatore: coimbatore, cbe
   madurai: madurai
   ```
4. Save

### Use Entity in Intent
1. Go to `Location.Outlets` intent
2. Add training phrase: "outlet in chennai"
3. Double-click "chennai" → Select `@city` entity
4. Save

This allows Dialogflow to extract city names automatically!

---

## Verification Checklist

After training, verify these work correctly:

**Service Queries:**
- [ ] "haircut" → Shows haircut prices
- [ ] "beard trim" → Shows beard services
- [ ] "facial" → Shows facial services
- [ ] "spa" → Shows hair spa services

**Booking:**
- [ ] "book appointment" → Asks for date/city

**Location:**
- [ ] "where is your outlet" → Asks for city
- [ ] "chennai" → Shows Chennai outlets

**Franchise:**
- [ ] "franchise" → Shows franchise info

**Timing:**
- [ ] "timing" → Shows opening hours

**Price:**
- [ ] "price" → Shows price list

---

## Quick Reference: Creating an Intent

1. Click **CREATE INTENT**
2. Name: Use format `Category.Action` (e.g., `Services.Haircut`)
3. Add **Training Phrases** (10-15 minimum)
4. Enable **Webhook** (if you want backend to handle response)
5. Add **Response** (if Dialogflow should respond directly)
6. Click **SAVE**

---

## Testing Tips

### Test in Dialogflow Console
1. Use "Try it now" panel on right
2. Enter user queries
3. Check detected intent and confidence
4. If confidence < 0.6, add more training phrases

### Test in WhatsApp
1. Send message to Twilio number
2. Check bot response
3. Review logs in Render dashboard

---

## Maintenance

**Weekly:**
- Review **Training** tab
- Approve/reject recent queries
- Add new training phrases for common queries

**Monthly:**
- Check intent detection accuracy
- Add new intents for new services
- Review and update responses

---

## Need Help?

**Dialogflow Documentation:**
- https://cloud.google.com/dialogflow/docs

**McKingstown Bot Support:**
- Check logs in Render dashboard
- Test locally with `/webhook/test` endpoint

---

## Summary

✅ Create 10 essential intents
✅ Add 10-15 training phrases per intent
✅ Enable webhook for dynamic responses
✅ Test in Dialogflow simulator
✅ Deploy and test in WhatsApp

**Time Required:** 30-45 minutes

**Impact:** Bot will understand 90%+ of customer queries accurately!

---

*Last Updated: December 24, 2025*
