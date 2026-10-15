# Manual Test Checklist — Spicy Junction Kitchen

## 📊 Status

**Manual pass completed** · 192 passed · 20 failed · 8 not run.

All 20 failures were triaged and fixed; every one is now covered by the Playwright suite. This document is kept for two reasons:

1. **The record** — what was found, what it traced to, and whether it's resolved.
2. **The remaining checklist** — a substantial part of the app is *not* automated (see [Automation coverage](#-automation-coverage)), and these rows are still the only coverage it has.

**How to use:** Run `npm run dev`, open `http://localhost:3000`. Tick the Pass column or write FAIL + a note.
Tiers: **P0** money/data paths · **P1** navigation & filters · **P2** cosmetic/external.

**Reset between sessions:** DevTools → Application → Local Storage → delete all three keys:
`sjk_restaurant_cart`, `sjk_order_history`, `spicy_junction_manual_reviews`.

### ID formats

Both schemes now derive from `brand.idPrefix` in `config/restaurant.config.ts`, via `lib/ids.ts`.

| Kind | Format | Source |
|---|---|---|
| Order id | `SJK-1234` | `createOrderId()` — `idPrefix` + last 4 digits of epoch ms |
| Reservation id | `SJK-RES-123` | `createBookingId()` — `idPrefix` + `RES` + 3 random digits |

They were previously inconsistent — orders derived from `brand.shortName` while reservations used a hardcoded `SJK-RES-` literal, so renaming the restaurant changed one and not the other. Unified in `lib/ids.ts`; renaming now moves both together.

**Viewport:** run once at Desktop 1280px wide and once at Mobile 390px wide (DevTools device toolbar → iPhone 14 Pro).

---

## Reference values

Use these to check totals. Config: currency `₹` prefix, **tax 0%**, **packaging ₹20 on Takeaway only**.

| Item                                   | Price |
| -------------------------------------- | ----- |
| Special Hyderabadi Chicken Dum Biryani | ₹240  |
| Royal Nizami Mutton Dum Biryani        | ₹360  |
| Spicy Egg Dum Biryani                  | ₹190  |
| Shahi Subz & Paneer Dum Biryani        | ₹210  |
| Solo Dining Chicken Biryani Meal       | ₹260  |
| Solo Quick Bite Egg Biryani Box        | ₹180  |
| Solo Paneer Tikka Biryani Platter      | ₹230  |
| Hyderabadi Chicken 65                  | ₹190  |
| Andhra Green Chilli Chicken Dry        | ₹200  |
| Tandoori Paneer Tikka Small Plate      | ₹180  |
| Crispy Samosa Quick Bite (3 Pcs)       | ₹90   |
| Crispy Corn Pepper Fry                 | ₹140  |
| Old Delhi Style Butter Chicken         | ₹240  |
| Traditional Mirchi Ka Salan            | ₹90   |
| Handkerchief Rumali Roti (2 Pcs)       | ₹50   |
| Butter Garlic Naan                     | ₹60   |
| Hyderabadi Double Ka Meetha            | ₹110  |
| Cooling Masala Buttermilk (Chaas)      | ₹50   |

**Worked totals to verify against:**

- 1× Chicken Dum Biryani (₹240), Takeaway → subtotal **₹240** · packaging **₹20** · grand **₹260**
- Same bag, Dine-in → subtotal **₹240** · no packaging row · grand **₹240**
- 2× Solo Chicken Meal (₹260) + 1× Chaas (₹50), Takeaway → subtotal **₹570** · packaging **₹20** · grand **₹590**

---

## Cross-cutting checks (C-series)

Run these first — they catch state bugs that make every other row misleading.

| ID  | Steps                                                          | Expected                                                                                 | Pass                                   |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| C1  | Add 2 different dishes, reload page                            | Both dishes still in bag, badge shows 2                                                  | ✔️                                     |
| C2  | Place an order, reload page                                    | Order appears in Order History tab; receipt modal opens automatically (order is <2h old) | ✔️                                     |
| C3  | Any total on any surface                                       | No tax line anywhere (tax is 0%); grand = subtotal + ₹20 Takeaway / + ₹0 Dine-in         | ✔️                                     |
| C4  | With cart drawer open, press `Esc`                             | Drawer closes                                                                            | ❌ Drawer not closing when press 'Esc' |
| C5  | With reservation modal open, press `Esc`                       | Modal closes                                                                             | ✔️                                     |
| C6  | With receipt modal open, click the dark area outside the panel | Modal closes                                                                             | ✔️                                     |
| C7  | Submit a guest review, reload page                             | Review still listed, above the 3 seeded Google reviews                                   | ✔️                                     |
| C8  | Toggle Takeaway → Dine-in with items in bag                    | Packaging row disappears, grand total drops by ₹20, in both drawer and /order            | ✔️                                     |
| C9  | Mobile 390px: scroll to page bottom                            | Sticky mobile action bar does not cover footer links                                     | ❌ need to adjust little               |

---

## NAV — Navbar (desktop: all · mobile: overlay)

| ID     | Element                 | Steps                                           | Expected                                          | Tier | Pass |
| ------ | ----------------------- | ----------------------------------------------- | ------------------------------------------------- | ---- | ---- |
| NAV-1  | Brand wordmark          | Click "Spicy and hot Junction Kitchen" top-left | Navigates to `/`                                  | P1   | ✔️   |
| NAV-2  | Home link               | Click "Home"                                    | Navigates to `/`                                  | P1   | ✔️   |
| NAV-3  | Menu link               | Click "Menu & Dishes"                           | Navigates to `/menu`                              | P1   | ✔️   |
| NAV-4  | Order link              | Click "Takeaway & Order"                        | Navigates to `/order`                             | P1   | ✔️   |
| NAV-5  | Atmosphere link         | Click "Atmosphere"                              | Navigates to `/atmosphere`                        | P1   | ✔️   |
| NAV-6  | Contact link            | Click "Location & Hours"                        | Navigates to `/contact`                           | P1   | ✔️   |
| NAV-7  | Active state            | On `/menu`, look at nav                         | "Menu & Dishes" is orange + has an underline bar  | P2   | ✔️   |
| NAV-8  | Cart button             | Click "Takeaway Order"                          | Cart drawer slides in from right                  | P0   | ✔️   |
| NAV-9  | Cart badge              | Bag empty, then add 1 dish, then another        | Badge hidden when empty; shows 1, then 2          | P0   | ✔️   |
| NAV-10 | Cart badge sync         | Add 3 of one dish via +                         | Badge shows 3 (sum of quantities, not item count) | P0   | ✔️   |
| NAV-11 | Cart button persistence | Navigate to another page after adding items     | Drawer closed but badge still shows count         | P0   | ✔️   |

### Mobile overlay only

| ID     | Element              | Steps                                       | Expected                                       | Tier | Pass                                 |
| ------ | -------------------- | ------------------------------------------- | ---------------------------------------------- | ---- | ------------------------------------ |
| NAV-M1 | Hamburger            | At 390px, click the ☰ icon                 | Overlay drops down with 5 links                | P1   | ❌ width overflow and not responding |
| NAV-M2 | Hamburger toggle     | Click ☰ again                              | Overlay closes, icon becomes ☰                | P1   | ❌ not responding                    |
| NAV-M3 | Overlay link         | Open overlay, click any link                | Navigates AND overlay closes automatically     | P1   | ❌ not responding                    |
| NAV-M4 | Overlay active       | Open overlay while on `/contact`            | "Location & Hours" has orange background + dot | P2   | ❌ not responding                    |
| NAV-M5 | Reserve from overlay | Open overlay, click "Reserve Dine-In Table" | Overlay closes, reservation modal opens        | P0   | ❌ not responding                    |

## MAB — Mobile action bar (390px only)

| ID    | Element           | Steps                      | Expected                                  | Tier | Pass                                                |
| ----- | ----------------- | -------------------------- | ----------------------------------------- | ---- | --------------------------------------------------- |
| MAB-1 | Menu              | Click "Menu"               | Navigates to `/menu`                      | P1   | ✔️                                                  |
| MAB-2 | Table             | Click "Table"              | Reservation modal opens                   | P0   | ❌ not responding                                   |
| MAB-3 | Call              | Click "Call"               | Phone app opens / dialer with the number  | P1   | ✔️                                                  |
| MAB-4 | Order count       | Bag empty, then add 1 dish | Label reads "Order (0)", then "Order (1)" | P0   | ❌ models not working / dishes not adding on mobile |
| MAB-5 | Order button      | Click "Order"              | Cart drawer opens                         | P0   | ❌ models not working on mobile                     |
| MAB-6 | Hidden on desktop | Resize to 1280px           | Bar is not visible                        | P2   | ✔️                                                  |

---

## CART — Cart drawer

| ID      | Element              | Steps                                                                       | Expected                                                                       | Tier | Pass                                       |
| ------- | -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---- | ------------------------------------------ |
| CART-1  | Empty state          | Open with empty bag                                                         | "Your bag is empty" + explanatory text, no totals/footer                       | P0   | ✔️                                         |
| CART-2  | Add item             | Click "Add to Order" on any dish                                            | Drawer opens with that item, qty 1                                             | P0   | ✔️                                         |
| CART-3  | Auto-open            | Click add on a dish while on `/menu`                                        | Drawer opens automatically                                                     | P0   | ✔️                                         |
| CART-4  | Close X              | Click ✕ top-right                                                           | Drawer closes                                                                  | P1   | ✔️                                         |
| CART-5  | Close backdrop       | Click dark area left of panel                                               | Drawer closes                                                                  | P1   | ✔️                                         |
| CART-6  | Increase qty         | Click + twice on a ₹240 item                                                | Qty shows 3, line total ₹720, subtotal updates                                 | P0   | ✔️                                         |
| CART-7  | Decrease qty         | Click − once from qty 3                                                     | Qty shows 2, totals decrease                                                   | P0   | ✔️                                         |
| CART-8  | Decrement to zero    | Set qty to 1, click −                                                       | Line disappears entirely. **Note: no undo**                                    | P0   | ✔️                                         |
| CART-9  | Service toggle       | Click "Takeaway (Pickup)" / "Dine-in Pre-order"                             | Selected one highlighted white; grand total changes per C8                     | P0   | ✔️                                         |
| CART-10 | Clear all            | With 2+ items, click "Clear all"                                            | Bag empties immediately. **Note: no confirmation dialog**                      | P0   | ✔️                                         |
| CART-11 | Add cooking note     | Click "Add cooking note" on an item                                         | Input + Save button appear                                                     | P1   | ☐                                          |
| CART-12 | Save note            | Type "extra salan", click Save                                              | Orange note bar shows "Note: extra salan"                                      | P1   | ✔️                                         |
| CART-13 | Edit note            | Click "Edit" on the note bar                                                | Input pre-filled with existing text                                            | P1   | ✔️                                         |
| CART-14 | Empty note           | Save an empty string                                                        | Note bar disappears (falsy check)                                              | P1   | ✔️                                         |
| CART-15 | Fulfillment select   | Open dropdown                                                               | Lists "ASAP", 8 lunch slots (11:45 AM–3:15 PM), 9 dinner slots (7:15–11:15 PM) | P1   | ✔️                                         |
| CART-16 | Payment: counter     | Click "Pay at Counter"                                                      | Orange highlighted                                                             | P1   | ✔️                                         |
| CART-17 | Payment: UPI         | Click "UPI / QR Code"                                                       | Orange highlighted                                                             | P1   | ✔️                                         |
| CART-18 | Validation           | Clear name + phone, click "Confirm & Track"                                 | Red error box: "Please enter your name and phone number to complete order."    | P0   | ❌ message showing only highlighting field |
| CART-19 | Submit               | Fill name + phone, click "Confirm & Track"                                  | Button shows "Confirming Order..." then drawer closes                          | P0   | ✔️                                         |
| CART-20 | Receipt auto-open    | Continue from CART-19                                                       | Receipt modal opens with "Order Confirmed!"                                    | P0   | ✔️                                         |
| CART-21 | Submit button target | Confirm button lives in drawer footer but submits a form in the drawer body | Verify clicking it works (uses `form` attribute)                               | P0   | ☐                                          |
| CART-22 | Scroll               | Add 6+ different dishes                                                     | Item list scrolls, footer stays pinned and visible                             | P2   | ✔️                                         |

---

## RES — Reservation modal

| ID     | Element             | Steps                                                                                                 | Expected                                                                | Tier | Pass                             |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---- | -------------------------------- |
| RES-1  | Open entry points   | Trigger from: home hero, /contact "Book Table", /atmosphere banner, mobile overlay, mobile action bar | Modal opens each time                                                   | P0   | ❌ on mobile not working buttons |
| RES-2  | Date default        | Open modal                                                                                            | Date field pre-filled with today's date                                 | P1   | ✔️                               |
| RES-3  | Date change         | Pick a future date                                                                                    | Value updates                                                           | P1   | ✔️                               |
| RES-4  | Dining option       | Switch Lunch ↔ Dinner                                                                                 | Label text updates to show the service window                           | P1   | ✔️                               |
| RES-5  | Guests              | Type 4                                                                                                | Field shows 4                                                           | P1   | ✔️                               |
| RES-6  | Guests = 1          | Set guests to 1                                                                                       | Preference auto-switches to "Solo Diner"                                | P1   | ✔️                               |
| RES-7  | Guests 1 → 3        | Then raise back to 3                                                                                  | Preference stays on "Solo Diner". **Flag: doesn't auto-correct**        | P1   | ✔️                               |
| RES-8  | Guests bounds       | Try entering 0 or 25                                                                                  | `min=1` / `max=24` clamp the input                                      | P2   | ✔️                               |
| RES-9  | Preferences         | Click each of Solo Diner / Group (Friends) / Family & Kids                                            | Exactly one highlighted orange                                          | P1   | ✔️                               |
| RES-10 | Special requests    | Type text into textarea                                                                               | Value holds                                                             | P2   | ✔️                               |
| RES-11 | Cancel              | Click "Cancel"                                                                                        | Modal closes, nothing saved                                             | P1   | ❌ saving                        |
| RES-12 | Required validation | Submit with name and phone blank                                                                      | Browser blocks submit, fields flagged                                   | P0   | ✔️                               |
| RES-13 | Confirm             | Fill name + phone, click "Confirm Reservation"                                                        | Success panel: green check, "Table Reserved!", booking ID `SJK-RES-###` | P0   | ✔️                               |
| RES-14 | Booking ID format   | Read the ID                                                                                           | Matches `SJK-RES-` + 3 digits                                           | P0   | ✔️                               |
| RES-15 | Success detail      | Check the text                                                                                        | Shows guest name, party size, meal type, date                           | P1   | ✔️                               |
| RES-16 | WhatsApp booking    | Click "Send Reservation to WhatsApp"                                                                  | Opens wa.me in new tab with booking details encoded                     | P2   | ✔️                               |
| RES-17 | Done                | Click "Done"                                                                                          | Modal closes                                                            | P1   | ✔️                               |
| RES-18 | Reopen resets       | Reopen after a successful booking                                                                     | Fresh empty form, previous values gone                                  | P1   | ❌ saving details                |

---

## RCPT — Order receipt modal

| ID      | Element          | Steps                                                  | Expected                                                               | Tier | Pass |
| ------- | ---------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | ---- | ---- |
| RCPT-1  | Header           | Open receipt                                           | Badge "Receipt & Tracking" + order ID (see note)                       | P0   | ✔️   |
| RCPT-2  | Success banner   | Read top                                               | Green check, "Order Confirmed!", customer name                         | P0   | ✔️   |
| RCPT-3  | Timeline         | Read status block                                      | Received ✓ / Accepted ✓ / Cooking (pulsing orange) / Ready (grey)      | P1   | ✔️   |
| RCPT-4  | Fulfillment info | Read bottom of status block                            | "Target: <selected time>" and service type                             | P0   | ✔️   |
| RCPT-5  | Itemized lines   | Check each line                                        | `Nx <name>` + line total; cooking notes shown in orange italics        | P0   | ✔️   |
| RCPT-6  | Totals           | Read breakdown                                         | Subtotal, packaging, grand total all match the bag at checkout         | P0   | ✔️   |
| RCPT-7  | WhatsApp main    | Click "Open in WhatsApp (Pre-Filled Bill)"             | New tab, `wa.me/917981901713?text=...` with full bill encoded          | P2   | ✔️   |
| RCPT-8  | WhatsApp footer  | Click "Send to WhatsApp"                               | Same destination as RCPT-7                                             | P2   | ✔️   |
| RCPT-9  | Print            | Click "Print Bill"                                     | Print dialog opens, layout is clean receipt-only (no buttons/backdrop) | P2   | ✔️   |
| RCPT-10 | Done             | Click "Done"                                           | Modal closes                                                           | P1   | ✔️   |
| RCPT-11 | Close X          | Click ✕                                                | Modal closes                                                           | P1   | ✔️   |
| RCPT-12 | Backdrop         | Click dark area                                        | Modal closes                                                           | P1   | ✔️   |
| RCPT-13 | Print CSS        | In print preview, confirm nav/footer/chrome are hidden | Only receipt content prints                                            | P2   | ✔️   |

---

## HOME — Home page (`/`)

| ID      | Element              | Steps                                           | Expected                                                                  | Tier | Pass |
| ------- | -------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- | ---- | ---- |
| HOME-1  | Explore Menu CTA     | Click "Explore Menu & Prices"                   | Navigates to `/menu`                                                      | P1   | ✔️   |
| HOME-2  | Reserve CTA          | Click "Reserve Table"                           | Reservation modal opens                                                   | P0   | ✔️   |
| HOME-3  | Quick Takeaway       | Click "Quick Takeaway"                          | Cart drawer opens                                                         | P0   | ✔️   |
| HOME-4  | Google verified link | Click the "View Real Google Maps Reviews" strip | Opens share.google link in new tab                                        | P2   | ✔️   |
| HOME-5  | Featured dishes      | Scroll to "Popular Signatures"                  | Exactly 3 dish cards (Chicken Biryani, Mutton Biryani, Solo Chicken Meal) | P1   | ✔️   |
| HOME-6  | Dish add             | Click "Add to Order · ₹240" on a featured card  | Cart drawer opens with that item                                          | P0   | ✔️   |
| HOME-7  | Dish add repeat      | Add the same dish again                         | Label changes to "Add Another (In Bag: 1)", qty becomes 2                 | P0   | ✔️   |
| HOME-8  | View all dishes      | Click "View all dishes & small plates"          | Navigates to `/menu`                                                      | P1   | ✔️   |
| HOME-9  | Atmosphere CTA       | Click "Explore Kitchen Story & Hall Tour"       | Navigates to `/atmosphere`                                                | P1   | ✔️   |
| HOME-10 | Bottom directions    | Click "Get Directions & Map"                    | Navigates to `/contact`                                                   | P1   | ✔️   |
| HOME-11 | Bottom order         | Click "Order Takeaway"                          | Navigates to `/order`                                                     | P1   | ✔️   |
| HOME-12 | Hero image           | Inspect hero                                    | Image loads, no broken-image icon                                         | P2   | ✔️   |
| HOME-13 | Features bar         | Inspect the 4-card strip                        | 4 features from config render                                             | P2   | ✔️   |

### Google reviews section (also on `/contact`)

| ID     | Element             | Steps                                        | Expected                                                                        | Tier | Pass |
| ------ | ------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- | ---- | ---- |
| GRV-1  | View on Maps        | Click "View On Google Maps"                  | Opens share.google link in new tab                                              | P2   | ✔️   |
| GRV-2  | Write review        | Click "Write Google Review"                  | Opens share.google link in new tab                                              | P2   | ✔️   |
| GRV-3  | Copy link           | Click "Copy Google Maps Link"                | Text flips to "Link copied to clipboard" for ~2s                                | P2   | ✔️   |
| GRV-4  | Seeded reviews      | Inspect the grid                             | 3 seeded reviews, 5 stars each, "Google Maps" source tag                        | P1   | ✔️   |
| GRV-5  | Open modal          | Click "Add Guest Review"                     | Modal opens with empty form                                                     | P1   | ✔️   |
| GRV-6  | Star rating         | Click the 3rd star                           | Stars 1–3 fill amber, 4–5 stay grey                                             | P1   | ✔️   |
| GRV-7  | Submit              | Fill name + review text, click "Save Review" | Button shows "Submitting...", then success panel appears                        | P0   | ✔️   |
| GRV-8  | New review listed   | After submit                                 | Review appears first in the grid, tagged "Manual Guest Review", date "Just now" | P0   | ✔️   |
| GRV-9  | Post to Google      | Click "Post this review on Google Maps"      | Opens share.google link in new tab                                              | P2   | ✔️   |
| GRV-10 | Close modal         | Click "Close" on success panel               | Modal closes                                                                    | P1   | ✔️   |
| GRV-11 | Cancel              | Open modal, click "Cancel"                   | Modal closes, nothing saved                                                     | P1   | ✔️   |
| GRV-12 | Modal ✕             | Open modal, click ✕ in header                | Modal closes                                                                    | P1   | ✔️   |
| GRV-13 | Required validation | Submit with name or text blank               | Browser blocks submit                                                           | P1   | ✔️   |
| GRV-14 | Diner type          | Open the Experience Type dropdown            | 4 options: Solo Diner, Family with Kids, Group/Friends, Takeaway Customer       | P2   | ✔️   |

---

## MENU — Menu page (`/menu`)

| ID      | Element               | Steps                                      | Expected                                                                 | Tier | Pass    |
| ------- | --------------------- | ------------------------------------------ | ------------------------------------------------------------------------ | ---- | ------- |
| MENU-1  | Full grid             | Load with no filters                       | All 18 dishes render                                                     | P1   | ✔️      |
| MENU-2  | Search by name        | Type "biryani"                             | Only dishes with biryani in the name show                                | P1   | ✔️      |
| MENU-3  | Search by description | Type "saffron"                             | Matches on description text                                              | P1   | saffron |
| MENU-4  | Search no match       | Type "zzzz"                                | Empty state appears                                                      | P1   | ✔️      |
| MENU-5  | Clear search          | Type then click "Clear"                    | Input empties, full grid returns                                         | P1   | ✔️      |
| MENU-6  | Category tabs         | Click each of the 6 tabs                   | Grid filters; clicked tab turns orange                                   | P1   | ✔️      |
| MENU-7  | Category: Biryani     | Click "Hyderabadi Dum Biryani"             | 4 dishes (Chicken, Mutton, Egg, Paneer)                                  | P1   | ✔️      |
| MENU-8  | Category: Solo        | Click "Solo Dining Combos"                 | 3 dishes                                                                 | P1   | ✔️      |
| MENU-9  | Diet filter           | Click "Vegetarian"                         | Only veg dishes remain                                                   | P1   | ✔️      |
| MENU-10 | Diet: Egg             | Click "Egg"                                | Egg Dum Biryani + Solo Quick Bite Egg Box                                | P1   | ✔️      |
| MENU-11 | Diet: Non-Veg         | Click "Non-Veg"                            | Only non-veg dishes                                                      | P1   | ✔️      |
| MENU-12 | Spice filter          | Click "Fiery"                              | Chicken 65 + Green Chilli Chicken only                                   | P1   | ✔️      |
| MENU-13 | Combined filters      | Category Biryani + Diet Veg                | Only Shahi Subz & Paneer Dum Biryani                                     | P1   | ✔️      |
| MENU-14 | Impossible combo      | Pick a combo that matches nothing          | "No dishes match your filters" empty state                               | P1   | ✔️      |
| MENU-15 | Reset filters         | From an empty state, click "Reset Filters" | All filters clear, 18 dishes return                                      | P1   | ✔️      |
| MENU-16 | Dish add              | Click "Add to Order" on any card           | Cart drawer opens, item added                                            | P0   | ✔️      |
| MENU-17 | Dish add repeat       | Add the same dish again                    | Label becomes "Add Another (In Bag: 1)"                                  | P0   | ☐       |
| MENU-18 | Dietary dot           | Inspect each card                          | Green dot = veg, red dot = non-veg. **Flag: egg dishes show red**        | P2   | ✔️      |
| MENU-19 | Spice label           | Inspect a card                             | Shows e.g. "2-3 persons shareable · fiery spice"                         | P2   | ✔️      |
| MENU-20 | Price currency        | Read a card price                          | `₹240`. **Flag: hardcoded ₹ in the add-button label, not config-driven** | P2   | ✔️      |

---

## ORD — Order page (`/order`)

### Tabs & history

| ID    | Element           | Steps                                              | Expected                                                                 | Tier | Pass |
| ----- | ----------------- | -------------------------------------------------- | ------------------------------------------------------------------------ | ---- | ---- |
| ORD-1 | Create tab        | Load page                                          | "Create Order (N)" active, orange                                        | P1   | ✔️   |
| ORD-2 | Tab counter       | Add items elsewhere, then load `/order`            | Count in the tab label matches                                           | P0   | ✔️   |
| ORD-3 | History tab       | Click "Order History (0)"                          | Empty state: "No past orders found"                                      | P1   | ✔️   |
| ORD-4 | Start first order | From empty history, click "Start Your First Order" | Returns to Create tab                                                    | P1   | ✔️   |
| ORD-5 | History populated | Place an order, reopen history                     | Card shows ID, service type, date/time, items, total, "Kitchen Received" | P0   | ✔️   |
| ORD-6 | View live receipt | Click "View Live Receipt" on a history card        | Receipt modal opens for that order                                       | P0   | ✔️   |
| ORD-7 | Oldest order      | With 2+ orders                                     | Newest listed first                                                      | P0   | ✔️   |

### Building the order

| ID     | Element                | Steps                                      | Expected                                                           | Tier | Pass |
| ------ | ---------------------- | ------------------------------------------ | ------------------------------------------------------------------ | ---- | ---- |
| ORD-8  | Takeaway card          | Click "Takeaway Counter"                   | Highlights orange with "Active" badge, packaging row appears       | P0   | ✔️   |
| ORD-9  | Dine-in card           | Click "Dine-In Table Pre-Order"            | Highlights stone/black, packaging row disappears                   | P0   | ✔️   |
| ORD-10 | Table number field     | Switch to Dine-in                          | "Table Number" field appears                                       | P0   | ✔️   |
| ORD-11 | Table number hidden    | Switch back to Takeaway                    | Field disappears                                                   | P0   | ✔️   |
| ORD-12 | Full menu link         | Click "Full Menu →" near solo platters     | Navigates to `/menu`                                               | P1   | ✔️   |
| ORD-13 | Solo add               | Click "Add to Order · ₹260" on a solo card | Item appears in Order Summary                                      | P0   | ✔️   |
| ORD-14 | Quick bite add         | Click "+ Add" on any of the 4 quick bites  | Item appears in Order Summary                                      | P0   | ✔️   |
| ORD-15 | Solo list size         | Count solo cards                           | 3 cards                                                            | P1   | ✔️   |
| ORD-16 | Quick bite list size   | Count quick-bite cards                     | 4 cards — all `isQuickBite` items (`.slice(0, 3)` was removed)       | P1   | ✔️   |
| ORD-17 | Summary +/−            | Add 2 items, click + on one                | Qty and line total update                                          | P0   | ✔️   |
| ORD-18 | Summary decrement to 0 | Decrement a qty-1 line                     | Line removed                                                       | P0   | ✔️   |
| ORD-19 | Clear bag              | Click "Clear bag"                          | Summary returns to empty state                                     | P0   | ✔️   |
| ORD-20 | Empty state CTA        | Click "Browse Full Menu"                   | Navigates to `/menu`                                               | P1   | ✔️   |
| ORD-21 | Place Order disabled   | With empty bag                             | "Place Takeaway Order" button is disabled/dimmed                   | P0   | ✔️   |

### Checkout form

| ID     | Element               | Steps                      | Expected                                        | Tier | Pass              |
| ------ | --------------------- | -------------------------- | ----------------------------------------------- | ---- | ----------------- |
| ORD-22 | Name + phone          | Type into both             | Values hold                                     | P1   | ✔️                |
| ORD-23 | Email field           | Type an email              | Value holds                                     | P2   | ❌ no email felid |
| ORD-24 | Fulfillment select    | Open dropdown              | ASAP + 8 lunch + 9 dinner slots                 | P1   | ✔️                |
| ORD-25 | Kitchen notes         | Type text                  | Value holds                                     | P2   | ✔️                |
| ORD-26 | Payment counter       | Click "Pay at Counter"     | Orange card selected                            | P1   | ✔️                |
| ORD-27 | Payment UPI           | Click "UPI QR Code"        | Orange card selected                            | P1   | ✔️                |
| ORD-28 | Validation            | Blank name/phone, submit   | Red "Note:" box appears                         | P0   | ✔️                |
| ORD-29 | Pay-at-counter submit | Fill fields, submit        | Button → "Processing Order..." → receipt opens  | P0   | ✔️                |
| ORD-30 | Payment status        | Check receipt after ORD-29 | Status is pay-on-arrival                        | P0   | ✔️                |
| ORD-31 | Form reset            | After ORD-29               | Name/phone/email/table/notes fields all cleared | P0   | ✔️                |
| ORD-32 | Bag cleared           | After ORD-29               | Bag emptied                                     | P0   | ✔️                |

### UPI QR modal

| ID     | Element          | Steps                                 | Expected                                           | Tier | Pass                      |
| ------ | ---------------- | ------------------------------------- | -------------------------------------------------- | ---- | ------------------------- |
| ORD-33 | Open modal       | Select UPI, fill name + phone, submit | QR modal opens with correct grand total            | P0   | ✔️                        |
| ORD-34 | QR visual        | Inspect                               | QR icon + UPI ID line showing `7981901713@upi`     | P2   | ✔️                        |
| ORD-35 | Simulate success | Click "Simulate Payment Success"      | Modal closes, order placed, receipt opens          | P0   | ✔️                        |
| ORD-36 | Paid status      | Check receipt                         | Payment shows as PAID                              | P0   | ❌ no message paid status |
| ORD-37 | Cancel           | Open modal, click "Cancel"            | Modal closes, form retains values, no order placed | P0   | ✔️                        |

---

## CON — Contact page (`/contact`)

| ID     | Element           | Steps                                   | Expected                                                                       | Tier | Pass |
| ------ | ----------------- | --------------------------------------- | ------------------------------------------------------------------------------ | ---- | ---- |
| CON-1  | Open in Maps      | Click "Open in Google Maps"             | Opens share.google link in new tab                                             | P2   | ✔️   |
| CON-2  | Copy address      | Click "Copy Address"                    | Label flips to "Copied!"                                                       | P2   | ✔️   |
| CON-3  | Copy reverts      | Wait 2s after CON-2                     | Label returns to "Copy Address"                                                | P2   | ✔️   |
| CON-4  | Clipboard content | Paste after copying                     | Contains the full address from config                                          | P2   | ✔️   |
| CON-5  | WhatsApp us       | Click "WhatsApp Us"                     | Opens wa.me with prefilled inquiry text                                        | P2   | ✔️   |
| CON-6  | Book table        | Click "Book Table"                      | Reservation modal opens                                                        | P0   | ✔️   |
| CON-7  | Primary phone     | Click the bold phone number             | Dialer opens                                                                   | P1   | ✔️   |
| CON-8  | Get route         | Click "Get Driving Route to Shop No 10" | Opens share.google link in new tab                                             | P2   | ✔️   |
| CON-9  | Timings           | Read the Operating Hours card           | Lunch 11:30–3:30, Dinner 7:00–11:30, Open Daily                                | P1   | ✔️   |
| CON-10 | FAQ               | Scroll to FAQ section                   | 5 questions with answers all render                                            | P1   | ✔️   |
| CON-11 | Address block     | Read Kitchen Address card               | Shop No 10, Almasguda Rd, Hanuman Nagar, Badangpet, Telangana 500113, landmark | P1   | ✔️   |

---

## FOOT — Footer (every page)

| ID     | Element           | Steps                                         | Expected                           | Tier | Pass |
| ------ | ----------------- | --------------------------------------------- | ---------------------------------- | ---- | ---- |
| FOOT-1 | Phone link        | Click the phone number in Visit Kitchen       | Dialer opens                       | P1   | ✔️   |
| FOOT-2 | Directions link   | Click "View Driving Directions & Landmarks →" | Navigates to `/contact`            | P1   | ✔️   |
| FOOT-3 | Maps profile      | Click "Google Maps Profile"                   | Opens share.google link in new tab | P2   | ✔️   |
| FOOT-4 | Full Menu         | Click "Full Menu"                             | Navigates to `/menu`               | P1   | ✔️   |
| FOOT-5 | Takeaway Counter  | Click "Takeaway Counter"                      | Navigates to `/order`              | P1   | ✔️   |
| FOOT-6 | Atmosphere        | Click "Atmosphere"                            | Navigates to `/atmosphere`         | P1   | ✔️   |
| FOOT-7 | Contact & Parking | Click "Contact & Parking"                     | Navigates to `/contact`            | P1   | ✔️   |
| FOOT-8 | Copyright         | Read bottom bar                               | Current year + restaurant name     | P2   | ✔️   |

---

## ATM — Atmosphere page (`/atmosphere`)

| ID    | Element         | Steps                           | Expected                                           | Tier | Pass |
| ----- | --------------- | ------------------------------- | -------------------------------------------------- | ---- | ---- |
| ATM-1 | Reserve banner  | Click "Reserve Table For Today" | Reservation modal opens                            | P0   | ✔️   |
| ATM-2 | Menu CTA        | Click "See Menu & Order Dishes" | Navigates to `/menu`                               | P1   | ✔️   |
| ATM-3 | Pillars         | Scroll through cards            | 3 pillars render with icons, badges, bullet points | P2   | ✔️   |
| ATM-4 | Heritage points | Scroll to kitchen secret        | 3 heritage points render                           | P2   | ✔️   |
| ATM-5 | Images          | Inspect hero + 2 thumbnails     | All load, no broken icons                          | P2   | ✔️   |

---

## ERR — Error pages

| ID    | Element        | Steps                                 | Expected                               | Tier | Pass |
| ----- | -------------- | ------------------------------------- | -------------------------------------- | ---- | ---- |
| ERR-1 | 404 page       | Visit `/does-not-exist`               | Styled 404 with icon, heading, message | P1   | ✔️   |
| ERR-2 | 404 → menu     | Click "Explore Food Menu"             | Navigates to `/menu`                   | P1   | ✔️   |
| ERR-3 | 404 → home     | Click "Back to Home"                  | Navigates to `/`                       | P1   | ✔️   |
| ERR-4 | 404 phone      | Read bottom line                      | Phone number present                   | P2   | ✔️   |
| ERR-5 | Error boundary | Trigger a runtime error (dev only)    | Error page with "Something went wrong" | P1   | ✔️   |
| ERR-6 | Try again      | Click "Try Again" on the error page   | `reset()` re-renders the route         | P1   | ✔️   |
| ERR-7 | Return home    | Click "Return Home" on the error page | Navigates to `/`                       | P1   | ✔️   |

---

## API — Route handlers

Test with `curl` in a second terminal while `npm run dev` runs.

| ID     | Call                                               | Expected                                           | Tier | Pass |
| ------ | -------------------------------------------------- | -------------------------------------------------- | ---- | ---- |
| API-1  | `curl http://localhost:3000/api/orders`            | 200, `{ status: "ok", endpoint: "/api/orders" }`   | P1                                                                                                 | ✔️   |
| API-2  | `curl http://localhost:3000/api/bookings`          | 200, `{ status: "ok", endpoint: "/api/bookings" }` | P1                                                                                                 | ✔️   |
| API-3  | POST `/api/orders` with a valid order body         | 200, `{ success: true, orderId }`                  | P0                                                                                                 | ☐    |
| API-4  | POST `/api/orders` missing `customer` / `items`    | 400, "Invalid order payload"                       | P0                                                                                                 | ✔️   |
| API-5  | POST `/api/orders` with malformed JSON             | 500                                                | P1                                                                                                 | ✔️   |
| API-6  | POST `/api/bookings` with a valid body             | 200, `{ success: true, bookingId }`                | P0                                                                                                 | ✔️   |
| API-7  | POST `/api/bookings` missing `name`/`phone`/`date` | 400 with the validation message                    | P0                                                                                                 | ✔️   |
| API-8  | Dev-server console                                 | After API-3 / API-6                                | `[Order API] New order received: #...` and `[Booking API] New table reservation: ...` lines appear | P1   | ✔️  |
| API-9  | Place an order through the UI                      | Browser Network tab                                | POST to `/api/orders` returns 200; also POSTs to the same endpoint from `orderDispatcher`          | P0   | ✔️  |
| API-10 | Submit a reservation                               | Browser Network tab                                | POST to `/api/bookings` returns 200                                                                | P0   | ✔️  |

---

## A11Y — Accessibility & keyboard

| ID      | Element           | Steps                                                 | Expected                                                             | Tier | Pass                                  |
| ------- | ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------- | ---- | ------------------------------------- |
| A11Y-1  | Tab order         | Tab from page load                                    | Focus moves logically: skip nothing trapped                          | P1   | ✔️                                    |
| A11Y-2  | Focus ring        | Tab through buttons                                   | Visible orange focus outline on each                                 | P2   | ✔️                                    |
| A11Y-3  | Esc: cart         | Cart drawer open, press Esc                           | Closes (NOTE: CartDrawer has no Esc handler — verify manually)       | P1   | ❌ when esc cartDrawer not responding |
| A11Y-4  | Esc: reservation  | Reservation modal open, press Esc                     | Closes                                                               | P1   | ☐                                     |
| A11Y-5  | Esc: receipt      | Receipt modal open, press Esc                         | Closes (NOTE: no Esc handler — verify)                               | P1   | ❌ when esc cartDrawer not responding |
| A11Y-6  | Esc: review       | Review modal open, press Esc                          | Closes (NOTE: no Esc handler — verify)                               | P1   | ❌ when esc cartDrawer not responding |
| A11Y-7  | Focus trap        | Tab through an open modal                             | Focus stays inside the modal. **Likely fails — no trap implemented** | P1   | ☐                                     |
| A11Y-8  | Dialog semantics  | Inspect reservation modal                             | `role="dialog"` + `aria-modal="true"` present                        | P2   | ☐                                     |
| A11Y-9  | Labelled controls | Inspect cart buttons                                  | `aria-label` present on increase/decrease/close                      | P2   | ❌ when clicked not responding        |
| A11Y-10 | Touch targets     | At 390px, tap each mobile-bar item and overlay button | Comfortably tappable, no mis-taps                                    | P2   | ✔️                                    |
| A11Y-11 | Icon-only buttons | Inspect ✕ / ✕-in-modal / backdrop                     | Named for screen readers or not focusable                            | P2   | ✔️                                    |

---

## Findings log

The 20 failures from the manual pass, grouped by the underlying bug. Each row reconciles to the ❌ marks above.

| Bug | Failed checks | Root cause | Status |
|---|---|---|---|
| **Mobile controls rendered off-screen** | `C9`, `NAV-M1..M5`, `MAB-2/4/5`, `RES-1` (10) | Navbar row had three `shrink-0` children needing ~515px in a 390px viewport. Document laid out 530px wide; hamburger rendered at x=490 (off-screen) and the fixed bottom bar anchored below the fold. | ✅ fixed |
| **No Esc handler on 3 overlays** | `C4`, `A11Y-3`, `A11Y-5`, `A11Y-6` (4) | Only `components/ui/Modal.tsx` registered a keydown listener. `CartDrawer`, `OrderReceiptModal` and the review modal hand-rolled their own overlay markup. | ✅ fixed |
| **Reservation form leaked guest details** | `RES-11`, `RES-18` (2) | `handleClose` reset only the success state, never the 8 form fields — so a cancelled or completed booking left the next guest's name and phone number on screen. | ✅ fixed |
| **No email field on `/order`** | `ORD-23` (1) | `customerEmail` state was declared, submitted to `placeOrder` and cleared on success, but no `<input>` was ever bound to it. Email was silently always `undefined`. | ✅ fixed |
| **Receipt showed no payment status** | `ORD-36` (1) | `OrderReceiptModal` never referenced `paymentStatus` — a customer who paid by UPI saw no confirmation. Status existed only inside the encoded WhatsApp link. | ✅ fixed |
| **Native validation preempts the custom error** | `CART-18` (1) | Both name and phone inputs carry `required`, so the browser's native tooltip fires and `submit` never reaches `handleCheckout`. The in-app red error box is unreachable code. | ⬜ open |

**19 of 20 fixed.** The 20th failure, `A11Y-9` ("aria-label not responding"), was a mis-tick on the checklist — the labels were present and correct.

> Note: the "mobile not responding" cluster was initially suspected of being nine separate bugs. It was **one** CSS defect. Worth remembering when a whole category of UI failures clusters around one viewport — measure geometry before reading them as separate defects.

---

## Found during automation

These were not in the manual checklist — they surfaced once the Playwright suite ran.

| Bug | Impact | Status |
|---|---|---|
| **WhatsApp number had no country code** | Config held `"7981901713"` (10 digits). `wa.me` needs the full international number, so **every order and booking link was unroutable**. | ✅ fixed |
| **`tel:` hrefs contained spaces** | Built as `tel:+91 7981901713`; many diallers reject that outright. | ✅ fixed |
| **Order/reservation ID schemes inconsistent** | Orders derived `SPICYJUNCTION-` from the brand name; reservations used a hardcoded `SJK-RES-`. Renaming changed one only. | ✅ fixed |
| **`/api/orders` accepted `items: []`** | Guard was `!order.items`, which is `false` for an empty array, so a zero-item order returned 200. | ✅ fixed |
| **`/order` quantity steppers had no `aria-label`** | Screen readers announced them as bare "button". The cart drawer's steppers were labelled; these were not. | ✅ fixed |
| **Re-order ignored quantities** | `OrderHistoryModal` called `addToCart` once per line, so re-ordering a 3× order silently produced 1×. | ✅ fixed |
| **Quick Bites hid one dish** | `.slice(0, 3)` hid 1 of the 4 configured quick bites, making it unaddable from `/order`. *(Earlier notes said "2 of 5" — the config has 4, not 5.)* | ✅ fixed |

---

## Known issues

Open items only. Anything marked ✅ was fixed after the manual pass.

| # | Issue | Where | Status |
|---|---|---|---|
| 1 | Two conflicting WhatsApp numbers — orders went to `919849281734` while `/contact` and the UPI id showed `7981901713` | `lib/contact.ts` | ✅ fixed |
| 2 | Add-button price hardcoded `₹` instead of using the `currency` config | `components/DishCard.tsx` → add button label | ✅ fixed |
| 3 | "Clear all" empties the bag with no confirmation | `components/CartDrawer.tsx` → `clearCart` button | ⬜ open |
| 4 | Decrement-to-zero removes the line with no undo | `context/CartContext.tsx` → `updateQuantity` | ⬜ open |
| 5 | Egg **and vegan** dishes rendered the red "non-veg" dot | `DishCard.tsx`, `CartDrawer.tsx` → `DIETARY_META` | ✅ fixed |
| 6 | Guests 1 → N leaves the preference on "Solo Diner" | `ReservationModal.tsx` → guests `onChange` | ⬜ open |
| 7 | No Esc handler on cart / receipt / review overlays | `lib/useEscapeKey.ts` | ✅ fixed |
| 8 | No focus trap in any overlay — Tab escapes to the page behind | `Modal.tsx`, `CartDrawer.tsx`, `OrderReceiptModal.tsx` | ⬜ open |
| 9 | `OrderHistoryModal.tsx` was never imported — Re-order/Receipt unreachable | `components/OrderHistoryModal.tsx` | ✅ fixed |
| 10 | Empty-bag error in `handleOrderSubmit` is unreachable; the button is disabled when the bag is empty | `OrderPageClient.tsx` → Place Order `disabled` | ⬜ open |
| 11 | Quick Bites showed 3 of 4 configured dishes | `OrderPageClient.tsx` → `quickBites` | ✅ fixed |
| 12 | `address.postalCode` `500113` vs `address.full` ending `500112` | `config/restaurant.config.ts` → `address` | ✅ fixed |
| 13 | Native `required` validation preempted the custom error box | `CartDrawer.tsx` + `OrderPageClient.tsx` → `noValidate` | ✅ fixed |

**#3 and #4 are product decisions, not defects** — whether an unconfirmed "clear all" and an un-undoable removal are acceptable is a call for the owner, not a bug to fix.

---

## Automation coverage

68 Playwright tests × 2 viewports (desktop Chrome 1280×800, mobile 390×844).

Run `npm run test:e2e:prod` for a trustworthy result — it builds first and serves via `next start` on port 3100, alongside your dev server on 3000. The default `npm run test:e2e` reuses the dev server, which compiles routes on demand and can report spurious failures under parallel load; re-run before believing a failure there.

| Area | Spec | Status |
|---|---|---|
| Mobile layout overflow, hamburger, bottom action bar | `e2e/mobile-diagnostic.spec.ts` | automated |
| Esc-to-close, reservation state reset, email field, payment status | `e2e/fixes-regression.spec.ts` | automated |
| Contact number consistency, `tel:`/WhatsApp/UPI links, duplicate-declaration guard | `e2e/contact.spec.ts` | automated |
| `/api/orders` + `/api/bookings`, validation guards, UI→POST wiring, ID scheme | `e2e/api.spec.ts` | automated |
| Menu filters & search, cart/order/review persistence, re-order, navbar + footer routing, 404 | `e2e/pages.spec.ts` | automated |

### Still manual only

These rows above have **no automated coverage** and remain the checklist's real job:

- **Print output** — `RCPT-9`, `RCPT-13` (print CSS, receipt-only layout)
- **Clipboard** — `CON-2/3/4`, `GRV-3` (copy address, copy Maps link)
- **Focus trap** — `A11Y-7` (expected to fail; no trap implemented)
- **Error boundary** — `ERR-5/6/7` (runtime error, "Try Again", "Return Home")
- **Reservation edge cases** — `RES-8` (guests min/max clamping), `RES-6/7` (preference behaviour)
- **Drawer scroll** — `CART-22` (long lists keep the footer pinned)
- **Touch targets** — `A11Y-10` (real-device tap sizing)
- **Live external destinations** — every WhatsApp/Maps link is asserted by `href`, never by following it

> Coverage is mapped at **area level**, not row by row. A row-level map looked more useful but would have been guesswork, and a precise-looking wrong map is worse than an honest coarse one.

---

_Last manual pass: initial review · Updated after the automated regression pass._
