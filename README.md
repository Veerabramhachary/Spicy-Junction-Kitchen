# 🍽️ Restaurant Next.js Starter & Production Template

A modern, high-performance, responsive restaurant website and ordering system built with **Next.js 16 (App Router)** and **Tailwind CSS v4**.

Designed to be easily customizable in under 5 minutes for **any restaurant, cafe, cloud kitchen, biryani house, pizzeria, or bar** by simply editing a single configuration file (`/config/restaurant.config.ts`).

---

## ✨ Features & Architecture

### 1. ⚙️ Single-File Rebranding (`/config/restaurant.config.ts`)
- **Brand Info**: Name, short name, tagline, description, cuisine type, established year, and announcement notice banner.
- **Currency & Pricing**: Flexible currency symbol (`₹`, `$`, `£`, `€`, `AED`), decimal rules, packaging fees, and tax percentages.
- **Location & Google Maps**: Full address, landmark, driving directions, curb parking notes, and verified Google Business Profile links.
- **Kitchen Timings & Slots**: Lunch and dinner hours, order fulfillment time slots, and open days.
- **Menu Catalog**: Categories, items, prices, dietary tags (`veg`, `non-veg`, `egg`), spice level meters, serving size, and special labels (`isPopular`, `isSoloSpecial`, `isQuickBite`).
- **Atmosphere & FAQs**: Ambiance highlights, kid-friendly notes, group seating info, and frequently asked questions.

### 2. 🛍️ Complete Ordering Flow
- **Fulfillment Options**: Seamless toggle between **Takeaway** (curb/counter pickup) and **Dine-in** (table ordering).
- **Interactive Bag Drawer**: Fast slide-over drawer accessible from any page with item quantity adjustment and kitchen preparation notes.
- **Full Order Engine (`/order`)**: Dedicated page featuring quick add-ons, solo dining specials, and customizable fulfillment slots.
- **Payment Flexibility**:
  - *Pay at Counter* (Cash/Card/UPI upon arrival)
  - *Instant UPI QR Code Modal* (simulated high-contrast QR scan)
- **Order Tracking & Receipts**:
  - Automatic persistent order history saved to `localStorage`
  - Print-friendly thermal receipt (`window.print()`)
  - **1-Click WhatsApp Kitchen Dispatch** (`wa.me` message generator pre-formatted with order ID, item quantities, customer details, and total)

### 3. 📍 Google Maps & Verified Reviews Integration
- Direct integration with verified Google Business Profile link (`https://share.google/ZGE2LbwhaIkwXfKNC`).
- **No fake bot reviews**: Direct link to live Google Reviews + in-app verified diner feedback submission form with ratings and customer type filters.

### 4. 🪑 Table Reservation Modal
- Interactive reservation system for Lunch & Dinner with party size, special occasions, and free street parking reminders.

### 5. 🔍 SEO & Production Readiness
- **Next.js App Router**: Optimized server and client component separation.
- **OpenGraph & Twitter Cards**: High-resolution social share cards configured in `app/layout.tsx`.
- **Schema.org Structured Data**: Complete `Restaurant` JSON-LD schema with address, operating hours, cuisine, and menu links.
- **Tailwind CSS v4**: Ultra-fast utility styling with responsive typography and zero-jank transitions.

---

## 🚀 Quickstart: Customizing for Your Restaurant in 5 Minutes

### Step 1: Open the Config Hub
Open `/config/restaurant.config.ts` and update your restaurant's details:

```typescript
export const restaurantConfig: RestaurantConfig = {
  brand: {
    name: 'Your Restaurant Name',
    shortName: 'Your Brand',
    tagline: 'Your Catchy Tagline',
    description: 'A brief description of your food, kitchen, and passion.',
    cuisineType: 'Italian / Cafe / Biryani',
    establishedYear: 2024,
    bannerNotice: '🔥 Fresh Daily · Lunch & Dinner Service · Takeaway Available',
  },
  currency: {
    symbol: '$', // or '₹', '€', '£'
    code: 'USD',
    placement: 'prefix',
  },
  contact: {
    phone: '+1 555-123-4567',
    secondaryPhone: '',
    whatsapp: '15551234567',
    email: 'contact@yourrestaurant.com',
  },
  address: {
    shop: 'Suite 100',
    street: '123 Main Street',
    locality: 'Downtown',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'USA',
    full: '123 Main Street, Suite 100, San Francisco, CA 94105',
    landmark: 'Across from City Plaza',
    directionsNotes: {
      parkingInfo: 'Validated parking available in adjacent garage.',
    },
  },
  googleMaps: {
    shareUrl: 'https://maps.app.goo.gl/your-listing-link',
    verifiedBadgeText: 'Verified Google Business Profile',
  },
  // Update your menu items, categories, and timings below!
};
```

### Step 2: Add Your Photos
Place your hero banner, food platter, and interior images inside `/public/images/` and update the paths in `restaurantConfig.images`:
```typescript
images: {
  hero: '/images/my_hero_banner.jpg',
  soloPlatter: '/images/my_signature_dish.jpg',
  starters: '/images/my_appetizers.jpg',
  atmosphere: '/images/my_interior.jpg',
}
```

### Step 3: Run Locally or Deploy
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx             # Root layout with fonts, JSON-LD Schema, and meta
│   ├── page.tsx               # Homepage with Hero, Signature Dishes, and Trust strip
│   ├── menu/                  # Dynamic Menu page with category & spice filters
│   ├── order/                 # Complete Takeaway & Dine-In order engine
│   ├── atmosphere/            # Casual dining ambiance, solo comfort, and group seating
│   ├── contact/               # Location, operating hours, directions, and FAQ
│   ├── globals.css            # Tailwind v4 styles & design tokens
│   ├── loading.tsx            # Clean fallback loader
│   ├── not-found.tsx          # 404 page with navigation links
│   └── error.tsx              # Error boundary
├── components/
│   ├── CartDrawer.tsx         # Slide-over order bag with line-item notes
│   ├── DishCard.tsx           # Reusable food card with dietary indicators
│   ├── Footer.tsx             # Editorial footer with hours, address, and legal
│   ├── GoogleReviewsSection.tsx # Real Google Maps link & manual diner feedback form
│   ├── MobileActionBar.tsx    # Sticky mobile bottom bar for 1-tap call & ordering
│   ├── Navbar.tsx             # Top navigation bar
│   ├── OrderHistoryModal.tsx  # Order history drawer with live status progression
│   ├── OrderReceiptModal.tsx  # Printable receipt with WhatsApp kitchen dispatch
│   └── ReservationModal.tsx   # Lunch & dinner table reservation modal
├── config/
│   └── restaurant.config.ts   # 🌟 CENTRAL CONFIG HUB FOR REBRANDING
├── context/
│   └── CartContext.tsx        # Order state management and localStorage sync
├── lib/
│   └── restaurantData.ts      # Derived data helpers and formatPrice utility
└── types/
    ├── config.ts              # TypeScript interface for restaurant configuration
    └── restaurant.ts          # Menu item, cart, order, and review interfaces
```

---

## 🚢 Deployment

### Vercel / Cloud Run / Node.js
This is a standard Next.js 16 App Router application.

```bash
npm run build
npm run start
```

Default environment variables (in `.env.example`):
- `PORT=3000`
- `APP_URL=https://your-domain.com`

---

## 📄 License
MIT — Feel free to use and adapt for client work or your own restaurant business.
