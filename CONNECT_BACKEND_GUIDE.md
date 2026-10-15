# Developer Guide: Connecting Your Backend, CMS, Email & Google Sheets

This restaurant website template is architected to work completely standalone out of the box with zero required database infrastructure. It uses **direct communication protocols** (WhatsApp click-to-chat links) and **pluggable webhook/API routes** so you can easily link any backend, Google Sheet, or email service for free.

---

## 1. Quick WhatsApp Order & Booking Dispatch (Zero-Backend)

When a customer confirms a takeaway order or books a table:
1. The app generates an itemized, URL-encoded `wa.me/<phone>?text=...` link.
2. Clicking **"Send to WhatsApp"** opens WhatsApp directly with the customer's name, phone number, pickup/dining slot, dietary notes, and itemized bill.
3. The restaurant staff receives the message instantly on their phone or tablet running WhatsApp Business.

### How to configure:
The WhatsApp number has exactly **one** home: `contact.whatsapp` in `config/restaurant.config.ts`. It **must include the country code** — `lib/contact.ts` strips `+` and spaces, so the formatting is flexible, but a missing country code fails silently and every link goes nowhere:

```typescript
contact: {
    phone: '+91 7981901713',       // display form, used for tel: links
    whatsapp: '+91 7981901713',    // ✅ country code present
    // whatsapp: '917981901713',   // ✅ digits-only also works
    // whatsapp: '7981901713',     // ❌ no country code — dead links, no error
    email: 'hello@spicyandhotjunctionkitchen.in',
},
```

`lib/contact.ts` derives every other format from that single value — the order/booking `wa.me` links, the UPI address (`<digits>@upi`), and the `tel:` hrefs used by all call buttons. There is no separate `integrations.whatsappOrders.phoneNumber`; it was removed because it had drifted out of sync with the contact page and was silently sending orders to a different number than the one advertised.

---

## 2. Sending Orders & Bookings to Google Sheets (Free)

You can record every order or table booking as a row in a Google Sheet for free using Google Apps Script.

### Step-by-Step Setup:
1. Create a new Google Sheet (e.g. "Restaurant Orders & Bookings").
2. In the sheet menu, go to **Extensions** → **Apps Script**.
3. Replace the script code with:
```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Check if this is an order or a booking
    if (data.type === 'order') {
      sheet.appendRow([
        new Date(),
        'ORDER',
        data.orderId,
        data.customerName,
        data.customerPhone,
        data.serviceOption,
        data.fulfillmentTime,
        data.total,
        data.itemSummary || data.items,
        data.notes || ''
      ]);
    } else {
      sheet.appendRow([
        new Date(),
        'BOOKING',
        data.bookingId,
        data.guestName || data.name,
        data.phone,
        data.date,
        data.mealType,
        data.partySize,
        data.preference,
        data.specialRequests || ''
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
4. Click **Deploy** → **New deployment**.
5. Select type: **Web app**.
6. Set:
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
7. Copy the generated Web App URL.
8. Paste it into `config/restaurant.config.ts`:
```typescript
integrations: {
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbx.../exec',
}
```
Or in your environment variables (`.env`):
```env
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbx.../exec"
```

Now every order and reservation will automatically append to your Google Sheet!

---

## 3. Email Alerts via Formspree, Resend, or Webhooks (Free Tier)

### Option A: Free Formspree / Email Forwarding
1. Create a free endpoint at [formspree.io](https://formspree.io).
2. Set the endpoint in `config/restaurant.config.ts`:
```typescript
integrations: {
  webhookUrl: 'https://formspree.io/f/your_form_id',
}
```
Whenever an order is placed, Formspree sends an email notification directly to your inbox.

### Option B: Resend or Nodemailer in `/app/api/orders/route.ts`
If you deploy on Vercel, Node, or Cloud Run, you can send emails directly from Next.js:
```typescript
// app/api/orders/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'orders@yourrestaurant.com',
  to: 'manager@yourrestaurant.com',
  subject: `New Order #${order.id} from ${order.customer.name}`,
  html: `<h3>New Order Received</h3><p>Total: ${order.total}</p>`,
});
```

---

## 4. Connecting a Headless CMS or Custom Database

### Internal API Routes Provided:
The codebase includes ready-to-use Next.js App Router API routes:
- **`POST /api/orders`**: Receives complete order records (customer details, item list, quantities, cooking notes, fulfillment times, totals).
- **`POST /api/bookings`**: Receives table reservations (name, phone, date, lunch/dinner slot, party size, dining preference).

### To connect a database:
1. **Supabase / PostgreSQL**:
   In `app/api/orders/route.ts`, insert the record into your Supabase client:
   ```typescript
   await supabase.from('orders').insert([order]);
   ```
2. **Sanity / Strapi / Contentful (Headless CMS)**:
   Menu items and categories are currently defined in `config/restaurant.config.ts`. To fetch dynamically from a CMS, replace `restaurantConfig.menu` in `lib/restaurantData.ts` with a CMS fetch function (e.g. `getMenuItemsFromSanity()`).

---

## 5. Webhook Connectors (Zapier, Make, n8n)

Set your webhook URL in `config/restaurant.config.ts` or in `.env`:
```env
ORDER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/12345/abcde"
BOOKING_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/12345/fghij"
```
The application will automatically POST a JSON payload whenever an order or booking occurs. You can trigger SMS messages (Twilio), print to thermal cloud printers, or update inventory.
