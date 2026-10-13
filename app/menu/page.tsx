import type { Metadata } from 'next';
import React from 'react';
import { MenuClient } from './MenuClient';
import { restaurantConfig } from '../../config/restaurant.config';

export const metadata: Metadata = {
  title: `Menu & Prices | ${restaurantConfig.brand.name}`,
  description: `Explore our handcrafted menu of ${restaurantConfig.brand.cuisineType} dishes, biryani handis, solo dining meal platters, and quick bites at ${restaurantConfig.brand.name}.`,
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: `Menu & Prices | ${restaurantConfig.brand.name}`,
    description: `Complete menu with prices: Hyderabadi Dum Biryani, Solo Platters, Starters & Quick Bites.`,
    url: '/menu',
    images: [
      {
        url: restaurantConfig.images.hero,
        width: 1200,
        height: 630,
        alt: `${restaurantConfig.brand.name} Menu`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Menu & Prices | ${restaurantConfig.brand.name}`,
    description: `Complete menu with prices: Hyderabadi Dum Biryani, Solo Platters, Starters & Quick Bites.`,
    images: [restaurantConfig.images.hero],
  },
};

export default function MenuPage() {
  const menuJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${restaurantConfig.brand.name} Kitchen Menu`,
    hasMenuSection: restaurantConfig.categories
      .filter((c) => c.id !== 'all')
      .map((cat) => ({
        '@type': 'MenuSection',
        name: cat.label,
        description: cat.description,
        hasMenuItem: restaurantConfig.menu
          .filter((dish) => dish.category === cat.id)
          .map((dish) => ({
            '@type': 'MenuItem',
            name: dish.name,
            description: dish.description,
            offers: {
              '@type': 'Offer',
              price: dish.price,
              priceCurrency: restaurantConfig.currency.code,
            },
            suitableForDiet:
              dish.dietary === 'veg'
                ? 'https://schema.org/VegetarianDiet'
                : undefined,
          })),
      })),
  };

  return (
    <div className="shell shell-safe-bottom py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Handcrafted Kitchen Menu
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          {restaurantConfig.brand.cuisineType} Specialties & Dishes
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Cooked fresh daily for Lunch ({restaurantConfig.timings.lunch}) and Dinner ({restaurantConfig.timings.dinner}). Available for Dine-in and Takeaway counter pickup.
        </p>
      </div>

      <MenuClient />
    </div>
  );
}
