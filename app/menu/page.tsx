import type { Metadata } from 'next';
import React from 'react';
import { MenuClient } from './MenuClient';

export const metadata: Metadata = {
  title: 'Menu & Prices | Spicy Junction Kitchen Hyderabad',
  description: 'Explore authentic Hyderabadi Dum Biryani, solo dining meal boxes, and crispy small plates (Chicken 65, Paneer Tikka). Available for Dine-in & Takeaway in Badangpet.',
};

export default function MenuPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
          Handcrafted Kitchen Menu
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-stone-900 tracking-tight">
          Dum Biryani, Quick Bites & Small Plates
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Cooked fresh daily for Lunch (11:30 AM – 3:30 PM) and Dinner (7:00 PM – 11:30 PM). Available for Dine-in and Takeaway counter pickup.
        </p>
      </div>

      <MenuClient />
    </div>
  );
}
