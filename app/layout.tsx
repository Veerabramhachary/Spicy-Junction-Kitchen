import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ReservationModal } from '../components/ReservationModal';
import { MobileActionBar } from '../components/MobileActionBar';
import { RESTAURANT_INFO } from '../lib/restaurantData';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Spicy Junction Kitchen | Authentic Hyderabadi Biryani & Quick Bites',
  description: 'Authentic Hyderabadi Biryani, quick bites, small plates, solo dining and family kitchen at Shop No 7, Almasguda Rd, Hanuman Nagar, Badangpet, Hyderabad.',
  keywords: [
    'Hyderabadi Biryani',
    'Badangpet Biryani',
    'Solo dining Hyderabad',
    'Spicy Junction Kitchen',
    'Almasguda Road restaurant',
    'Chicken 65 Badangpet',
    'Mutton Dum Biryani Hyderabad',
    'Takeaway biryani Hyderabad',
  ],
  openGraph: {
    title: 'Spicy Junction Kitchen | Authentic Hyderabadi Biryani & Quick Bites',
    description: 'Authentic Hyderabadi Dum Biryani, quick bites, small plates, and solo dining comfort at Shop No 7, Almasguda Rd, Badangpet, Hyderabad.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spicy Junction Kitchen',
    description: 'Authentic Hyderabadi Biryani, quick bites & small plates in Badangpet, Hyderabad.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: RESTAURANT_INFO.name,
    servesCuisine: 'Hyderabadi, Indian',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${RESTAURANT_INFO.address.shop}, ${RESTAURANT_INFO.address.street}`,
      addressLocality: RESTAURANT_INFO.address.locality,
      addressRegion: RESTAURANT_INFO.address.state,
      postalCode: RESTAURANT_INFO.address.pincode,
      addressCountry: 'IN',
    },
    telephone: RESTAURANT_INFO.contact.phone,
    priceRange: '₹₹',
    openingHours: ['Mo-Su 11:30-15:30', 'Mo-Su 19:00-23:30'],
    hasMenu: '/menu',
  };

  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-orange-600 selection:text-white">
        <CartProvider>
          {/* Top Banner Notice */}
          <div className="bg-orange-700 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-3">
            <span>🔥 Serving Lunch (11:30 AM – 3:30 PM) & Dinner (7:00 PM – 11:30 PM)</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Free Street Parking at Shop No 7, Almasguda Rd, Badangpet</span>
          </div>

          <Navbar />

          <main className="flex-1">{children}</main>

          <MobileActionBar />
          <CartDrawer />
          <ReservationModal />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
