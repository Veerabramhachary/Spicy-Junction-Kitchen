import type { Metadata } from 'next';
import React from 'react';
import { MenuClient } from './MenuClient';
import { restaurantConfig } from '../../config/restaurant.config';

export const metadata: Metadata = {
  title: `Menu & Prices | ${restaurantConfig.brand.name}`,
  description: `Explore our handcrafted menu of ${restaurantConfig.brand.cuisineType} dishes, solo dining meal boxes, and quick bites at ${restaurantConfig.brand.name}.`,
};

export default function MenuPage() {
  return (
    <div className="shell shell-safe-bottom py-8 sm:py-12 space-y-10">
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
