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
  title: {
    default: `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
    template: `%s | ${restaurantConfig.brand.name}`,
  },
  description: restaurantConfig.brand.description,
  applicationName: restaurantConfig.brand.name,
  alternates: {
    canonical: '/',
  },
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
    'Almasguda Road restaurants',
    'Badangpet food',
  ],
  authors: [{ name: restaurantConfig.brand.name }],
  openGraph: {
    title: `${restaurantConfig.brand.name} | ${restaurantConfig.brand.tagline}`,
    description: restaurantConfig.brand.description,
    type: 'website',
    url: appUrl,
    siteName: restaurantConfig.brand.name,
    locale: 'en_IN',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
    '@id': `${appUrl}/#restaurant`,
    name: restaurantConfig.brand.name,
    description: restaurantConfig.brand.description,
    url: appUrl,
    telephone: restaurantConfig.contact.phone,
    servesCuisine: restaurantConfig.brand.cuisineType,
    image: `${appUrl}${restaurantConfig.images.hero}`,
    priceRange: '₹₹',
    currenciesAccepted: restaurantConfig.currency.code,
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    acceptsReservations: 'True',
    menu: `${appUrl}/menu`,
    hasMenu: `${appUrl}/menu`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${restaurantConfig.address.shop}, ${restaurantConfig.address.street}`,
      addressLocality: restaurantConfig.address.locality,
      addressRegion: restaurantConfig.address.state,
      postalCode: restaurantConfig.address.postalCode,
      addressCountry: restaurantConfig.address.country === 'India' ? 'IN' : restaurantConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '17.3168',
      longitude: '78.5302',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '11:30',
        closes: '15:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '19:00',
        closes: '23:30',
      },
    ],
    potentialAction: [
      {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${appUrl}/order`,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Order',
          orderStatus: 'http://schema.org/OrderStatus/OrderProcessing',
        },
      },
    ],
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
