import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { ReservationModal } from '../components/ReservationModal';
import { MobileActionBar } from '../components/MobileActionBar';
import { OrderReceiptPortal } from '../components/OrderReceiptPortal';
import { restaurantConfig } from '../config/restaurant.config';

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

const appUrl = process.env.APP_URL ? (process.env.APP_URL.startsWith('http') ? process.env.APP_URL : `https://${process.env.APP_URL}`) : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
  description: restaurantConfig.brand.description,
  keywords: [
    restaurantConfig.brand.name,
    restaurantConfig.brand.cuisineType,
    restaurantConfig.address.locality,
    restaurantConfig.address.city,
    'Takeaway ordering',
    'Dine-in menu',
    'Solo dining meal platters',
    'Hyderabad biryani takeaway',
    'Authentic dum handi',
  ],
  openGraph: {
    title: `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
    description: restaurantConfig.brand.description,
    type: 'website',
    siteName: restaurantConfig.brand.name,
    images: [
      {
        url: restaurantConfig.images.hero,
        width: 1200,
        height: 630,
        alt: `${restaurantConfig.brand.name} - ${restaurantConfig.brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
    description: restaurantConfig.brand.description,
    images: [restaurantConfig.images.hero],
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
    name: restaurantConfig.brand.name,
    servesCuisine: restaurantConfig.brand.cuisineType,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${restaurantConfig.address.shop}, ${restaurantConfig.address.street}`,
      addressLocality: restaurantConfig.address.locality,
      addressRegion: restaurantConfig.address.state,
      postalCode: restaurantConfig.address.postalCode,
      addressCountry: restaurantConfig.address.country,
    },
    telephone: restaurantConfig.contact.phone,
    priceRange: `${restaurantConfig.currency.symbol}${restaurantConfig.currency.symbol}`,
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
          {/* Top Banner Notice from Config */}
          {restaurantConfig.brand.bannerNotice && (
            <div className="bg-orange-700 text-white text-xs px-4 py-2 text-center font-medium flex items-center justify-center gap-3">
              <span>{restaurantConfig.brand.bannerNotice}</span>
            </div>
          )}

          <Navbar />

          <main className="flex-1">{children}</main>

          <MobileActionBar />
          <CartDrawer />
          <ReservationModal />
          <OrderReceiptPortal />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
