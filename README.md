# 🍽️ Spicy Junction Kitchen

Ordering website for a Hyderabad biryani house — menu browsing, takeaway & dine-in ordering, table reservations, and one-tap WhatsApp dispatch to the kitchen.

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.

The whole site is driven by one config file, so it also works as a starter for any other restaurant — see [Rebranding](#-rebranding-for-a-different-restaurant).

---

## 📖 Table of contents

- [Quickstart](#-quickstart)
- [Configuration](#-configuration)
- [⚠️ Config gotchas](#️-config-gotchas-read-this-before-deploying)
- [Architecture](#-architecture)
- [Ordering flow](#-ordering-flow)
- [Integrations](#-integrations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project structure](#-project-structure)
- [Maintenance notes](#-maintenance-notes)
- [Rebranding for a different restaurant](#-rebranding-for-a-different-restaurant)
- [License](#-license)

---

## 🚀 Quickstart

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3000 |
| `npm run lint` | `tsc --noEmit` type check |
| `npm run test:e2e` | Full Playwright suite (both viewports) |
| `npm run test:e2e:prod` | Same, against a production build — **use this before shipping** |
| `npm run test:e2e:desktop` | Desktop Chrome 1280×800 only |
| `npm run test:e2e:mobile` | Mobile 390×844 only |
| `npm run test:e2e:ui` | Playwright UI mode, for debugging a single run |
| `npm run test:e2e:report` | Open the last HTML report |

First test run needs the browser binary:

```bash
npx playwright install chromium
```

Git hooks install automatically via `npm install` (a `prepare` script runs `husky`). The pre-commit hook blocks commits containing credential-shaped strings — see [Maintenance notes](#-maintenance-notes).

Test server ports: the default run reuses your dev server on **3000** (Next will not start a second `next dev` for the same directory). `test:e2e:prod` builds and serves on **3100** so it can run alongside your dev server.

> **Prefer `test:e2e:prod` for anything you intend to trust.** The default reuses your `next dev` server, which compiles routes on demand; under parallel workers that intermittently exceeds action timeouts and reports failures that pass on re-run. Production mode builds once and runs against `next start`, so a green run actually means the app works.

---

## ⚙️ Configuration

Everything lives in **`config/restaurant.config.ts`** — a single typed object validated by `types/config.ts`. No other file needs editing to rebrand the site.

| Group | Controls |
|---|---|
| `brand` | Name, short name, **id prefix**, tagline, description, cuisine, banner notice |
| `currency` | Symbol, ISO code, prefix/suffix placement |
| `contact` | Phone, secondary phone, **WhatsApp**, email |
| `address` | Shop, street, locality, city, state, postal code, landmark, driving notes |
| `googleMaps` | Verified profile share URL + badge text |
| `timings` | Lunch/dinner windows, open days, and the order fulfillment slot lists |
| `services` | Feature flags for takeaway, dine-in, delivery, reservations |
| `pricing` | Packaging fee, tax %, delivery fee, minimum order |
| `menu` | 20 items with price, dietary tag, spice level, serving size, badges |
| `categories` | 6 menu categories driving the `/menu` filter tabs |
| `atmosphere` / `heritage` | Copy for the `/atmosphere` page |
| `initialReviews` / `faqs` | Seeded reviews and FAQ content |
| `integrations` | Webhook + Google Sheets URLs (the WhatsApp number is **not** here) |

---

## ⚠️ Config gotchas — read this before deploying

These are the settings that silently produce broken behaviour.

**1. `contact.whatsapp` must include the country code.**

```ts
whatsapp: "+91 7981901713",  // ✅ country code present
whatsapp: "917981901713",    // ✅ also fine
whatsapp: "7981901713",      // ❌ silent failure — no country code
```

`lib/contact.ts` strips `+` and spaces, so either formatting above works. **The country code is the part that is not optional** — sanitisation removes punctuation, it never adds `91`. Omit it and every WhatsApp link goes nowhere, with no error anywhere.

**2. There is exactly one place to set the number.** `contact.whatsapp` is the only source. `lib/contact.ts` derives every format from it:

- `WHATSAPP_NUMBER` — digits only, used by every `wa.me` link
- `UPI_ID` — the UPI address shown in the QR modal
- `TEL_HREF` — the `tel:` href used by all call buttons

Do **not** add a second `phoneNumber` under `integrations`. That duplication existed once and drifted: orders went to one number while the contact page advertised another. `e2e/contact.spec.ts` reads the config source and fails if a duplicate reappears.

**3. `taxRatePercent` is currently `0`.** No tax line renders anywhere — cart, order summary, or receipt. Set it to `5` for 5% GST and the rows appear automatically.

**4. Packaging fee applies to Takeaway only.** `takeawayPackagingFee: 20` is charged when `orderType === 'Takeaway'`; Dine-in hides the row entirely.

**5. `brand.idPrefix` drives every identifier.** Both schemes derive from it via `lib/ids.ts`:

- Orders → `SJK-1234`
- Reservations → `SJK-RES-123`

Change the prefix and both move together. (They were previously unrelated: orders derived from the brand name while reservations used a hardcoded literal, so renaming the restaurant silently changed only one of them.)

**6. Known data inconsistencies.** See [Maintenance notes](#-maintenance-notes).

---

## 🏗️ Architecture

### Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Hero, popular dishes, atmosphere spotlight, reviews |
| `/menu` | `app/menu/MenuClient.tsx` | Search + category / diet / spice filters |
| `/order` | `app/order/OrderPageClient.tsx` | Order engine: build & history tabs, UPI QR modal |
| `/atmosphere` | `app/atmosphere/page.tsx` | Dining experience copy |
| `/contact` | `app/contact/page.tsx` | Address, hours, map, FAQ, reviews |
| `/api/orders` | `app/api/orders/route.ts` | Order intake + validation + webhook forward |
| `/api/bookings` | `app/api/bookings/route.ts` | Reservation intake + validation + webhook forward |

Plus `not-found.tsx`, `error.tsx`, `loading.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`.

### Global chrome

`app/layout.tsx` mounts these on every page inside `CartProvider`, so roughly 40% of the interactive surface is reachable from every route:

`Navbar` · `MobileActionBar` · `CartDrawer` · `ReservationModal` · `OrderReceiptPortal` · `Footer`

### State

A single `CartContext` (`context/CartContext.tsx`) owns cart items, service type, overlay open flags, the price breakdown, order history, and the active order.

### Persistence

Everything is client-side in `localStorage` — **there is no database.**

| Key | Contents |
|---|---|
| `sjk_restaurant_cart` | `CartItem[]` |
| `sjk_order_history` | `OrderRecord[]`, newest first |
| `spicy_junction_manual_reviews` | Guest-submitted `ReviewItem[]` |

On load, if the newest order is under 2 hours old and not `completed`, it is restored as the active order — which reopens the receipt modal. Users must dismiss it.

### Single-source modules

| Module | Owns |
|---|---|
| `lib/contact.ts` | The phone/WhatsApp number and every derived link format |
| `lib/ids.ts` | Order and reservation id generation |
| `lib/orderDispatcher.ts` | WhatsApp link building + webhook fan-out |
| `lib/useEscapeKey.ts` | Close-on-Escape for overlays |
| `lib/dateUtils.ts` | Deterministic, hydration-safe date formatting |

---

## 🛍️ Ordering flow

**Service types.** Takeaway (counter pickup) and Dine-in (table pre-order). Switching changes the packaging row and the grand total, and reveals the optional table-number field on Dine-in.

**Price calculation** (`CartContext`):

```
subtotal     = Σ (item.price × quantity)
packagingFee = orderType === 'Takeaway' ? 20 : 0
taxAmount    = round(subtotal × taxRatePercent / 100)     // currently 0
grandTotal   = subtotal + packagingFee + taxAmount
```

**Cart drawer.** Opens from the navbar, the mobile action bar, or any "add to cart" button. Supports quantity steppers, per-dish cooking notes, and clearing the bag.

**Payment paths.**

- *Pay at Counter* — order is recorded with `pending_at_counter`
- *UPI / QR Code* — a simulated QR modal, then "Simulate Payment Success" records the order as `paid`

The UPI QR is a **visual mockup**, not a real payment integration. No money moves.

**Receipt.** Opens automatically after checkout and on reload if a recent order exists. Shows the itemised bill, per-dish notes, totals, fulfillment target, and payment method/status. Supports `window.print()` for a clean receipt-only printout.

**Order history.** The `/order` history tab renders `OrderHistoryModal`, which lists past orders newest-first and offers **Re-order** — restoring the original quantities and cooking notes into the bag.

**Reservations.** Lunch/dinner, party size, dining preference, special requests. Confirmation shows a booking id and a WhatsApp dispatch link.

---

## 🔌 Integrations

Out of the box the app needs **no backend**. Orders and bookings are dispatched over WhatsApp click-to-chat links and logged via the internal API routes.

| Channel | Configure via | Notes |
|---|---|---|
| WhatsApp | `contact.whatsapp` | Always on. Pre-filled itemised bill. |
| Google Sheets (orders) | `ORDER_GOOGLE_SHEETS_WEBHOOK_URL` | Apps Script web app URL |
| Google Sheets (bookings) | `BOOKING_GOOGLE_SHEETS_WEBHOOK_URL` | Separate script — the two have different column layouts |
| Generic webhook (orders) | `ORDER_WEBHOOK_URL` | Zapier, Make, n8n, Formspree |
| Generic webhook fallback | `integrations.webhookUrl` in config | Used when `ORDER_WEBHOOK_URL` is unset |

All fan-out happens **server-side** in `/api/orders` and `/api/bookings`. The browser only POSTs to those routes — it never contacts a webhook directly. That was previously true, and setting both a config value and an env var produced duplicate notifications.

Dispatch failures are swallowed by design — a failed webhook never blocks a customer from ordering.

Full setup walkthroughs (Sheets script, Formspree, Supabase, CMS): **[CONNECT_BACKEND_GUIDE.md](./CONNECT_BACKEND_GUIDE.md)**.

---

## 🧪 Testing

The suite runs against real browser emulation, not a resized window.

```bash
npm run test:e2e:prod         # recommended: production build
npm run test:e2e              # fast: reuses the dev server
npm run test:e2e:mobile       # mobile regressions only
npm run test:e2e:ui           # interactive debugger
```

**68 tests × 2 viewports** (desktop Chrome 1280×800, mobile 390×844 with touch and iPhone UA). 6 skip conditionally — mobile-only controls skip on desktop and vice versa.

The dev-server run can be flaky under parallel load, because Next compiles routes on demand and cold pages intermittently exceed action timeouts. Production mode builds once and runs against `next start`, so a green run actually means the app works.

| Spec | Covers |
|---|---|
| `mobile-diagnostic` | Horizontal-overflow regression; hamburger and bottom-bar controls |
| `fixes-regression` | Esc-to-close, reservation state reset, email field, payment status |
| `contact` | Number consistency across all links; source-level duplicate guard |
| `api` | Both routes, validation, UI→POST wiring, id scheme |
| `pages` | Filters, search, persistence, re-order, navigation, 404 |

The mobile project deliberately uses **Chromium with iPhone characteristics** rather than `devices['iPhone 13']`, so any layout difference is a real CSS bug rather than a browser-engine difference.

Manual test plan with expected values and a findings log: **[docs/TESTING.md](./docs/TESTING.md)**.

That checklist is broader than the automated suite — a significant portion remains covered only by manual testing.

---

## 🚢 Deployment

Standard Next.js App Router app. Works on Vercel, Cloud Run, or any Node host.

```bash
npm run build
npm run start
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `APP_URL` | Recommended | Absolute URL for canonical links, OpenGraph and JSON-LD |
| `ORDER_GOOGLE_SHEETS_WEBHOOK_URL` | No | Apps Script endpoint for **order** rows |
| `BOOKING_GOOGLE_SHEETS_WEBHOOK_URL` | No | Apps Script endpoint for **booking** rows |
| `ORDER_WEBHOOK_URL` | No | Forward order payloads to an external service |

Copy `.env.example` to `.env` and fill in what you need. Nothing is required to run — without any of these the site works fully, with orders and bookings kept in the browser and dispatched over WhatsApp.

> `.env` is gitignored. The Apps Script URLs are **live write credentials** — anyone holding one can append rows to your sheet, which contains customer names and phone numbers. Never commit them; see [Maintenance notes](#-maintenance-notes).

---

## 📁 Project structure

```
├── app/
│   ├── api/{orders,bookings}/route.ts  # Order + booking intake
│   ├── atmosphere/page.tsx              # Dining experience
│   ├── contact/                        # Location, hours, FAQ, reviews
│   ├── menu/MenuClient.tsx             # Search + filters
│   ├── order/OrderPageClient.tsx       # Order engine
│   ├── layout.tsx                      # Fonts, JSON-LD schema, global chrome
│   ├── not-found.tsx  error.tsx  loading.tsx
│   └── robots.ts  sitemap.ts  manifest.ts  globals.css
├── components/
│   ├── CartDrawer.tsx                  # Slide-over bag, qty steppers, notes
│   ├── DishCard.tsx                    # Menu card
│   ├── Footer.tsx  Navbar.tsx  MobileActionBar.tsx
│   ├── GoogleReviewsSection.tsx        # Maps link + guest review form
│   ├── OrderHistoryModal.tsx           # Past orders + re-order
│   ├── OrderReceiptModal.tsx           # Receipt + print + WhatsApp
│   ├── OrderReceiptPortal.tsx          # Mounts receipt from CartContext
│   ├── ReservationModal.tsx            # Table booking
│   ├── ReserveTableButton.tsx          # Opens reservation / cart
│   └── ui/                             # Button, Card, Modal primitives
├── config/restaurant.config.ts         # ⭐ SINGLE SOURCE OF TRUTH
├── context/CartContext.tsx             # Cart + order state, localStorage sync
├── lib/
│   ├── contact.ts                      # ⭐ Phone/WhatsApp number + link formats
│   ├── ids.ts                          # ⭐ Order + reservation id generation
│   ├── orderDispatcher.ts              # WhatsApp links, webhook fan-out
│   ├── dateUtils.ts  restaurantData.ts  useEscapeKey.ts
├── types/                              # config.ts, restaurant.ts
├── e2e/                                # Playwright specs
├── docs/TESTING.md                     # Manual checklist + findings log
└── playwright.config.ts
```

---

## 🧹 Maintenance notes

**Unused dependencies.** Three packages are declared but imported nowhere: `dotenv` and `motion` (dependencies) and `express` (devDependency). Safe to remove.

**Stale image config.** `next.config.mjs` still allows remote images from `images.unsplash.com` and `picsum.photos`. Every image now lives in `public/images/`, so those `remotePatterns` entries are unused.

**Dead config field.** `integrations.googleSheetWebhookUrl` in `restaurant.config.ts` is read by nothing. Sheets dispatch is configured exclusively through `ORDER_GOOGLE_SHEETS_WEBHOOK_URL` / `BOOKING_GOOGLE_SHEETS_WEBHOOK_URL`. Safe to delete.

**Secrets stay out of git.** A pre-commit hook (`scripts/check-secrets.mjs`, run via Husky) blocks commits containing credential-shaped strings. The Google Apps Script URLs are live write endpoints into a sheet holding customer PII — treat them as passwords. GitHub's own secret scanning is a second line of defence, but it only fires *after* a push, by which point the secret is in history.

**Dead code, previously.** `OrderHistoryModal` was never imported; it is now wired into `/order`. Worth checking that new components get mounted.

---

## 🎨 Rebranding for a different restaurant

Edit `config/restaurant.config.ts` and drop images into `public/images/`.

```ts
export const restaurantConfig: RestaurantConfig = {
  brand: {
    name: 'Your Restaurant Name',
    shortName: 'Your Brand',
    idPrefix: 'YRK',              // ids become YRK-1234 / YRK-RES-123
    tagline: 'Your Catchy Tagline',
    description: 'A brief description of your food and kitchen.',
    cuisineType: 'Italian / Cafe / Biryani',
    establishedYear: 2024,
    bannerNotice: '🔥 Fresh Daily · Takeaway Available',
  },

  currency: { symbol: '£', code: 'GBP', placement: 'prefix' },

  contact: {
    phone: '+44 20 7946 0958',
    secondaryPhone: '',
    whatsapp: '+44 20 7946 0958',  // country code REQUIRED; formatting is free
    email: 'contact@yourrestaurant.com',
  },

  address: { /* ... */ },
  googleMaps: { /* ... */ },
  timings: { /* ... */ },
  pricing: {
    takeawayPackagingFee: 2,
    taxRatePercent: 20,           // set > 0 to show tax lines
    minOrderForDelivery: 200,
    deliveryFee: 40,
  },
  // menu, categories, atmosphere, heritage, faqs, integrations ...
};
```

Images:

```ts
images: {
  hero: '/images/my_hero.jpg',
  soloPlatter: '/images/my_signature_dish.jpg',
  smallPlates: '/images/my_starters.jpg',
  atmosphere: '/images/my_interior.jpg',
},
```

Then run `npm run test:e2e`. Several tests assert restaurant-specific values and will need updating — `e2e/contact.spec.ts` and the id-scheme tests in `e2e/api.spec.ts` hardcode the `SJK` prefix and the WhatsApp number.

---

## 📄 License

MIT — feel free to use and adapt for client work or your own restaurant business.